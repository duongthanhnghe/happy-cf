import { UserModel } from "../../../models/v1/user.entity.js";
import { OrderEntity, OrderShippingEntity, OrderStatusEntity, PaymentEntity, ShippingProviderEntity } from "../../../models/v1/order.entity.js";
import { MembershipLevelModel } from "../../../models/v1/membership-level.entity.js";
import { toOrderDTO, toOrderExport, toOrderListDTO, toOrderShippingDTO, toOrderStatusListDTO, toPaymentListDTO, toShippingProviderDTO, toShippingProviderListDTO } from "../../../mappers/v1/order.mapper.js";
import { ORDER_STATUS } from "../../../shared/constants/order-status.js";
import { ProductReviewEntity } from "../../../models/v1/product-review.entity.js";
import { VoucherEntity } from "../../../models/v1/voucher.entity.js";
import { VoucherUsageEntity } from "../../../models/v1/voucher-usage.entity.js";
import mongoose from "mongoose";
import { restoreStockOrder } from "../../../utils/restoreStockOrder.js";
import XLSX from "xlsx";
import { buildVietQR } from "../../../utils/qrcode-payment.js";
import { buildBillHTML } from "../../../utils/print-bill.js";
export const getAllOrder = async (req, res) => {
    try {
        let { page = 1, limit = 10, fromDate, toDate, search, statusId, transactionId, shippingStatus } = req.query;
        const numPage = Number(page);
        let numLimit = Number(limit);
        const filter = {};
        if (fromDate || toDate) {
            filter.createdAt = {};
            if (fromDate)
                filter.createdAt.$gte = new Date(fromDate);
            if (toDate) {
                const endDate = new Date(toDate);
                endDate.setHours(23, 59, 59, 999);
                filter.createdAt.$lte = endDate;
            }
        }
        if (search) {
            const keyword = search.toString().trim();
            filter.$or = [
                { code: { $regex: keyword, $options: "i" } },
                { phone: { $regex: keyword, $options: "i" } },
                { fullname: { $regex: keyword, $options: "i" } }
            ];
        }
        if (statusId) {
            filter.status = statusId;
        }
        let transactionMatch = {};
        if (transactionId) {
            transactionMatch.status = transactionId;
        }
        let shippingMatch = {};
        if (shippingStatus) {
            shippingMatch.status = shippingStatus;
        }
        if (numLimit === -1) {
            const orders = await OrderEntity.find(filter)
                .sort({ createdAt: -1 })
                .populate("paymentId")
                .populate("status")
                .populate("userId")
                .populate({
                path: "transaction",
                model: "PaymentTransaction",
                match: transactionMatch
            })
                .populate({
                path: "cartItems.idProduct",
                model: "Product",
                select: "image productName"
            })
                .populate({
                path: "shipping",
                model: "OrderShipping",
                match: shippingMatch,
                populate: {
                    path: "providerId",
                    model: "ShippingProvider"
                }
            });
            const filtered = transactionId
                ? orders.filter(o => o.transaction !== null)
                : orders;
            return res.json({
                code: 0,
                data: toOrderListDTO(filtered),
                pagination: {
                    page: 1,
                    limit: filtered.length,
                    totalPages: 1,
                    total: filtered.length
                }
            });
        }
        const options = {
            page: numPage,
            limit: numLimit,
            sort: { createdAt: -1 },
            populate: [
                { path: "paymentId", model: "Payment" },
                { path: "status", model: "OrderStatus" },
                { path: "userId", model: "User" },
                {
                    path: "transaction",
                    model: "PaymentTransaction",
                    match: transactionMatch
                },
                {
                    path: "shipping",
                    model: "OrderShipping",
                    match: shippingMatch,
                    populate: {
                        path: "providerId",
                        model: "ShippingProvider",
                    }
                },
                { path: "cartItems.idProduct", model: "Product", select: "image productName" }
            ]
        };
        let result = await OrderEntity.paginate(filter, options);
        if (transactionId) {
            result.docs = result.docs.filter(doc => {
                const transaction = doc.transaction;
                return transaction && transaction.status === transactionId;
            });
        }
        if (shippingStatus) {
            result.docs = result.docs.filter(doc => {
                const shipping = doc.shipping;
                return shipping && shipping.status === shippingStatus;
            });
        }
        const totalFiltered = result.docs.length;
        return res.json({
            code: 0,
            data: toOrderListDTO(result.docs),
            pagination: {
                page: result.page,
                limit: result.limit,
                totalPages: Math.ceil(totalFiltered / result.limit),
                total: totalFiltered
            }
        });
    }
    catch (error) {
        return res
            .status(500)
            .json({ code: 1, message: "Lỗi lấy danh sách order", error });
    }
};
export const getOrderById = async (req, res) => {
    try {
        const order = await OrderEntity.findById(req.params.id)
            .populate("paymentId")
            .populate("status")
            .populate("userId")
            .populate({ path: "transaction", model: "PaymentTransaction" })
            .populate({
            path: "cartItems.idProduct",
            model: "Product",
            select: "productName image",
        });
        if (!order) {
            return res.status(404).json({ code: 1, message: "Order không tồn tại" });
        }
        return res.json({ code: 0, data: toOrderDTO(order) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const deleteOrder = async (req, res) => {
    try {
        const deleted = await OrderEntity.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ code: 1, message: "Order không tồn tại" });
        }
        return res.json({ code: 0, message: "Xoá thành công" });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const rollbackVoucherUsage = async (order) => {
    if (!(order === null || order === void 0 ? void 0 : order.userId) || !Array.isArray(order.voucherUsage))
        return;
    if (order.voucherRefunded)
        return;
    for (const vu of order.voucherUsage) {
        try {
            const voucher = await VoucherEntity.findOne({ code: vu.code });
            if (!voucher)
                continue;
            // ✅ rollback log
            await VoucherUsageEntity.updateMany({ userId: order.userId, orderId: order._id, code: vu.code }, { $set: { reverted: true, revertedAt: new Date() } });
            const userObjId = new mongoose.Types.ObjectId(order.userId);
            // ✅ rollback usedBy.count nếu user có trong usedBy
            const exists = await VoucherEntity.exists({
                code: vu.code,
                "usedBy.userId": userObjId,
            });
            if (exists && voucher.limitPerUser > 0) {
                await VoucherEntity.updateOne({ code: vu.code, "usedBy.userId": userObjId }, { $inc: { "usedBy.$.count": -1, usedCount: -1 } });
            }
            else {
                // rollback usedCount tổng
                await VoucherEntity.updateOne({ code: vu.code }, { $inc: { usedCount: -1 } });
            }
        }
        catch (err) {
            console.error(`❌ Lỗi rollback voucher ${vu.code}:`, err);
        }
    }
    await OrderEntity.findByIdAndUpdate(order._id, { voucherRefunded: true });
};
export const updateOrderStatus = async (req, res) => {
    var _a, _b;
    try {
        const { orderId, statusId } = req.body;
        if (!orderId || !statusId) {
            return res.status(400).json({ code: 1, message: "Thiếu orderId hoặc statusId" });
        }
        const status = await OrderStatusEntity.findById(statusId);
        if (!status) {
            return res.status(404).json({ code: 1, message: "Status không tồn tại" });
        }
        const order = await OrderEntity.findById(orderId);
        if (!order) {
            return res.status(404).json({ code: 1, message: "Order không tồn tại" });
        }
        if (order.cancelRequested && statusId !== ORDER_STATUS.CANCELLED) {
            return res.status(400).json({
                code: 1,
                message: "Khách đang yêu cầu hủy đơn, không thể thay đổi sang trạng thái này"
            });
        }
        if (((_a = order.status) === null || _a === void 0 ? void 0 : _a.toString()) === ORDER_STATUS.CANCELLED) {
            return res.status(400).json({
                code: 1,
                message: "Đơn hàng đã đã hủy, không thể thay đổi trạng thái nữa"
            });
        }
        order.status = statusId;
        // Nếu status = COMPLETED → tạo danh sách đánh giá
        if (status.id === ORDER_STATUS.COMPLETED && order.userId) {
            const existingReviews = await ProductReviewEntity.find({ orderId: orderId });
            if (existingReviews.length === 0) {
                const reviews = order.cartItems.map((item) => ({
                    orderId: orderId,
                    userId: order.userId,
                    productId: item.idProduct,
                    rating: 0,
                    comment: null,
                    images: [],
                    status: "pending",
                }));
                await ProductReviewEntity.insertMany(reviews);
            }
        }
        // Nếu status = done → cộng điểm cho user (nếu chưa cộng)
        if (status.id === ORDER_STATUS.COMPLETED && order.userId && !order.reward.awarded) {
            await setPointAndUpgrade(order.userId.toString(), order.reward.points);
            order.reward.awarded = true;
            order.reward.awardedAt = new Date();
            await order.save();
        }
        if (status.id === ORDER_STATUS.CANCELLED) {
            // hoàn kho
            if (order.stockDeducted) {
                await restoreStockOrder(order);
                order.stockDeducted = false;
            }
            if (order.userId) {
                const user = await UserModel.findById(order.userId);
                // Refund điểm người dùng
                if (!order.pointsRefunded && order.usedPoints > 0 && user) {
                    user.membership.balancePoint += order.usedPoints; // cong lai điểm người dùng
                    user.membership.balancePoint -= order.reward.points; // tru di điểm order da cong
                    order.pointsRefunded = true;
                }
                // Nếu đơn này từng cộng điểm thưởng → rollback lại
                if (((_b = order.reward) === null || _b === void 0 ? void 0 : _b.awarded) && order.reward.points > 0) {
                    await revertPointAndDowngrade(order.userId.toString(), order.reward.points);
                    order.reward.awarded = false;
                    order.reward.awardedAt = new Date();
                }
                await (user === null || user === void 0 ? void 0 : user.save());
            }
            // hoàn voucher
            await rollbackVoucherUsage(order);
        }
        await order.save();
        return res.json({ code: 0, message: "Cập nhật status thành công", data: toOrderDTO(order) });
    }
    catch (err) {
        console.error("Lỗi updateOrderStatus:", err);
        return res.status(500).json({ code: 1, message: err.message || "Internal Server Error" });
    }
};
export const getAllStatus = async (_, res) => {
    try {
        const status = await OrderStatusEntity.find().sort({ index: 1 });
        return res.json({ code: 0, data: toOrderStatusListDTO(status) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getAllPayment = async (_, res) => {
    try {
        const payments = await PaymentEntity.find();
        return res.json({ code: 0, data: toPaymentListDTO(payments) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const setPointAndUpgrade = async (userId, point) => {
    var _a, _b, _c, _d, _e;
    const user = await UserModel.findById(userId);
    if (!user)
        return null;
    const levels = await MembershipLevelModel.find();
    const newPoint = (((_a = user.membership) === null || _a === void 0 ? void 0 : _a.point) || 0) + point;
    const newBalancePoint = (((_b = user.membership) === null || _b === void 0 ? void 0 : _b.balancePoint) || 0) + point;
    const newLevel = levels
        .filter((level) => newPoint >= level.minPoint)
        .sort((a, b) => b.minPoint - a.minPoint)[0];
    const levelChanged = newLevel && ((_c = user.membership) === null || _c === void 0 ? void 0 : _c.level) !== newLevel.name;
    if (newLevel) {
        user.membership.level = newLevel.name;
        user.membership.discountRate = (_d = newLevel.discountRate) !== null && _d !== void 0 ? _d : 0;
        user.membership.pointRate = (_e = newLevel.pointRate) !== null && _e !== void 0 ? _e : 0;
    }
    user.membership.point = newPoint;
    user.membership.balancePoint = newBalancePoint;
    await user.save();
    return {
        level: user.membership.level,
        point: user.membership.point,
        balancePoint: user.membership.balancePoint,
        discountRate: user.membership.discountRate,
        pointRate: user.membership.pointRate,
        levelChanged,
    };
};
export const revertPointAndDowngrade = async (userId, pointsToRevert) => {
    const user = await UserModel.findById(userId);
    if (!user)
        return;
    user.membership.point = Math.max(0, user.membership.point - pointsToRevert);
    const newLevel = await MembershipLevelModel
        .findOne({ minPoint: { $lte: user.membership.point } })
        .sort({ minPoint: -1 });
    if (newLevel && newLevel.name !== user.membership.level) {
        user.membership.level = newLevel.name;
        user.membership.discountRate = newLevel.discountRate;
        user.membership.pointRate = newLevel.pointRate;
    }
    await user.save();
};
export const getOrderCountByStatus = async (req, res) => {
    try {
        const totalCount = await OrderEntity.countDocuments();
        const statuses = await OrderStatusEntity.find().lean();
        const counts = await OrderEntity.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ]);
        const countMap = new Map(counts.map(i => [i._id.toString(), i.count]));
        const statusItems = statuses
            .sort((a, b) => { var _a, _b; return ((_a = a.index) !== null && _a !== void 0 ? _a : 0) - ((_b = b.index) !== null && _b !== void 0 ? _b : 0); })
            .map(s => {
            var _a;
            return ({
                statusId: s._id.toString(),
                status: s.status,
                name: s.name,
                icon: s.icon,
                index: s.index,
                count: (_a = countMap.get(s._id.toString())) !== null && _a !== void 0 ? _a : 0
            });
        });
        const result = [
            {
                statusId: "",
                status: "all",
                name: "Tất cả",
                icon: "list_alt",
                index: -1,
                count: totalCount
            },
            ...statusItems
        ];
        return res.json({
            code: 0,
            data: result
        });
    }
    catch (error) {
        console.error("getOrderCountByStatus error:", error);
        return res.status(500).json({
            code: 1,
            message: "Lỗi lấy số lượng đơn hàng theo trạng thái"
        });
    }
};
export const printOrderBill = async (req, res) => {
    try {
        const order = await OrderEntity.findById(req.params.id)
            .populate("paymentId")
            .populate("status")
            .populate("userId")
            .populate({ path: "transaction", model: "PaymentTransaction" })
            .populate({
            path: "cartItems.idProduct",
            model: "Product",
            select: "productName sku",
        })
            .lean();
        if (!order) {
            return res.status(404).send("Order không tồn tại");
        }
        const siteName = req.query.siteName ||
            "";
        const qrUrl = buildVietQR(order);
        const html = buildBillHTML(order, qrUrl, siteName);
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.send(html);
    }
    catch (err) {
        return res.status(500).send(err.message);
    }
};
export const exportOrders = async (req, res) => {
    try {
        const orders = await OrderEntity.find()
            .populate("paymentId")
            .populate("status")
            .populate("userId")
            .populate({
            path: "transaction",
            model: "PaymentTransaction",
        })
            .populate({
            path: "shipping",
            model: "OrderShipping",
            populate: {
                path: "providerId",
                model: "ShippingProvider",
            },
        })
            .populate({
            path: "cartItems.idProduct",
            model: "Product",
            select: "productName sku",
        })
            .lean();
        if (!orders.length) {
            return res.status(200).json({
                code: 1,
                message: "Không có đơn hàng để export",
            });
        }
        const exportData = orders.map(toOrderExport);
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Orders");
        const excelBuffer = XLSX.write(workbook, {
            type: "buffer",
            bookType: "xlsx",
        });
        const fileName = `order_export_${Date.now()}.xlsx`;
        res.setHeader("Content-Disposition", `attachment; filename="${fileName}"; filename*=UTF-8''${encodeURIComponent(fileName)}`);
        res.setHeader("Content-Type", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        res.setHeader("X-Code", "0");
        res.setHeader("X-Message", "Export orders thành công");
        return res.send(excelBuffer);
    }
    catch (error) {
        console.error("Export orders error:", error);
        return res.status(500).json({
            code: 1,
            message: error.message,
        });
    }
};
export const getAllShippingProviders = async (req, res) => {
    try {
        const { active } = req.query;
        const filter = {};
        if (active !== undefined) {
            filter.isActive = active === "true";
        }
        const providers = await ShippingProviderEntity
            .find(filter)
            .sort({ name: 1 });
        return res.json({
            code: 0,
            message: "Lấy danh sách đơn vị vận chuyển thành công",
            data: toShippingProviderListDTO(providers)
        });
    }
    catch (error) {
        return res.status(500).json({
            code: 1,
            message: "Lỗi lấy danh sách đơn vị vận chuyển"
        });
    }
};
export const getShippingProviderDetail = async (req, res) => {
    try {
        const provider = await ShippingProviderEntity.findById(req.params.id);
        if (!provider) {
            return res.status(404).json({
                code: 1,
                message: "Đơn vị vận chuyển không tồn tại"
            });
        }
        return res.json({
            code: 0,
            message: "Lấy chi tiết đơn vị vận chuyển thành công",
            data: toShippingProviderDTO(provider)
        });
    }
    catch (error) {
        return res.status(500).json({
            code: 1,
            message: "Lỗi lấy chi tiết đơn vị vận chuyển"
        });
    }
};
export const createOrderShipping = async (req, res) => {
    try {
        const { orderId, providerId, trackingCode, shippingFee } = req.body;
        if (!orderId || !providerId) {
            return res.status(400).json({
                code: 1,
                message: "Thiếu orderId hoặc providerId"
            });
        }
        const order = await OrderEntity.findById(orderId);
        if (!order) {
            return res.status(404).json({
                code: 1,
                message: "Order không tồn tại"
            });
        }
        // 1 order chỉ có 1 vận đơn
        const existed = await OrderShippingEntity.findOne({ orderId });
        if (existed) {
            return res.status(400).json({
                code: 1,
                message: "Order đã có vận đơn"
            });
        }
        const shipping = await OrderShippingEntity.create({
            orderId,
            providerId,
            trackingCode,
            shippingFee: shippingFee !== null && shippingFee !== void 0 ? shippingFee : order.shippingFee,
            status: "pending",
            logs: [
                {
                    status: "pending",
                    description: "Tạo vận đơn",
                    time: new Date()
                }
            ]
        });
        // gán vận đơn vào order
        order.shipping = shipping._id;
        await order.save();
        return res.json({
            code: 0,
            data: shipping
        });
    }
    catch (error) {
        return res.status(500).json({
            code: 1,
            message: "Lỗi tạo vận đơn"
        });
    }
};
export const getOrderShippingDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const shipping = await OrderShippingEntity
            .findById(id)
            .populate({
            path: "providerId",
            model: "ShippingProvider"
        });
        if (!shipping) {
            return res.status(404).json({
                code: 1,
                message: "Vận đơn không tồn tại"
            });
        }
        return res.json({
            code: 0,
            message: "Lấy chi tiết vận đơn thành công",
            data: toOrderShippingDTO(shipping)
        });
    }
    catch (error) {
        return res.status(500).json({
            code: 1,
            message: "Lỗi lấy chi tiết vận đơn"
        });
    }
};
export const updateOrderShippingStatus = async (req, res) => {
    try {
        const { status, statusText } = req.body;
        const shipping = await OrderShippingEntity.findById(req.params.id);
        if (!shipping) {
            return res.status(404).json({
                code: 1,
                message: "Vận đơn không tồn tại"
            });
        }
        shipping.status = status;
        if (statusText)
            shipping.statusText = statusText;
        if (status === "shipping") {
            shipping.shippedAt = new Date();
        }
        if (status === "delivered") {
            shipping.deliveredAt = new Date();
        }
        shipping.logs.push({
            status,
            description: statusText || "Cập nhật trạng thái",
            time: new Date()
        });
        await shipping.save();
        return res.json({
            code: 0,
            data: shipping
        });
    }
    catch (error) {
        return res.status(500).json({
            code: 1,
            message: "Lỗi cập nhật trạng thái vận đơn"
        });
    }
};
//# sourceMappingURL=order.controller.js.map