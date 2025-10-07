import { UserModel } from "../models/UserEntity.js";
import { OrderEntity, OrderStatusEntity, PaymentEntity } from "../models/OrderEntity.js";
import { MembershipLevelModel } from "../models/MembershipLevelEntity.js";
import { toOrderDTO, toOrderListDTO, toOrderStatusListDTO, toPaymentListDTO } from "../mappers/orderMapper.js";
import { ORDER_STATUS } from "../shared/constants/order-status.js";
import { ProductReviewEntity } from "../models/ProductReviewEntity.js";
import { PaymentTransactionEntity } from "../models/PaymentTransactionEntity.js";
import { createSepayPayment } from '../services/sepay.service.js';
export const getAllOrder = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        const numPage = Number(page);
        let numLimit = Number(limit);
        if (numLimit === -1) {
            const orders = await OrderEntity.find({})
                .sort({ createdAt: -1 })
                .populate("paymentId")
                .populate("status")
                .populate("userId")
                .populate({ path: "transaction", model: "PaymentTransaction" });
            return res.json({
                code: 0,
                data: toOrderListDTO(orders),
                pagination: {
                    page: 1,
                    limit: orders.length,
                    totalPages: 1,
                    total: orders.length
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
                { path: "transaction", model: "PaymentTransaction" }
            ]
        };
        const result = await OrderEntity.paginate({}, options);
        return res.json({
            code: 0,
            data: toOrderListDTO(result.docs),
            pagination: {
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
                total: result.totalDocs
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
        const order = await OrderEntity.findById(req.params.id).populate("paymentId").populate("status").populate("userId").populate({ path: "transaction", model: "PaymentTransaction" });
        if (!order) {
            return res.status(404).json({ code: 1, message: "Order không tồn tại" });
        }
        return res.json({ code: 0, data: toOrderDTO(order) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const createOrder = async (req, res) => {
    try {
        const { data, userId, point, usedPoint } = req.body;
        if (!(data === null || data === void 0 ? void 0 : data.fullname) || !(data === null || data === void 0 ? void 0 : data.phone) || !(data === null || data === void 0 ? void 0 : data.paymentId) || !(data === null || data === void 0 ? void 0 : data.cartItems)) {
            return res.status(400).json({ code: 1, message: "Dữ liệu đơn hàng không hợp lệ" });
        }
        let membershipDiscountRate = 0;
        let membershipDiscountAmount = 0;
        if (userId) {
            const user = await UserModel.findById(userId);
            if (user) {
                membershipDiscountRate = user.membership.discountRate || 0;
                if (membershipDiscountRate > 0) {
                    membershipDiscountAmount = Math.floor(data.totalPriceCurrent * (membershipDiscountRate / 100));
                    // cập nhật lại totalPriceDiscount trước khi tính tiếp
                    data.totalPriceDiscount = data.totalPriceCurrent - membershipDiscountAmount;
                }
            }
        }
        let deductedPoints = 0;
        // ✅ Nếu có user và muốn dùng điểm
        if (userId && usedPoint && usedPoint > 0) {
            const user = await UserModel.findById(userId);
            if (!user) {
                return res.status(404).json({ code: 1, message: "Không tìm thấy user" });
            }
            if (user.membership.balancePoint < usedPoint) {
                return res.status(400).json({ code: 1, message: "Điểm tích lũy không đủ" });
            }
            // ✅ Trừ điểm từ balancePoint trong DB
            user.membership.balancePoint -= usedPoint;
            await user.save();
            deductedPoints = usedPoint;
        }
        const newOrder = await OrderEntity.create({
            ...data,
            userId,
            reward: { points: point || 0, awarded: false, awardedAt: null },
            usedPoints: deductedPoints,
            pointsRefunded: false,
            membershipDiscountRate,
            membershipDiscountAmount,
        });
        return res.status(201).json({
            code: 0,
            message: "Đặt hàng thành công",
            data: toOrderDTO(newOrder),
        });
    }
    catch (err) {
        console.error("Lỗi createOrder:", err);
        return res.status(500).json({ code: 2, message: "Lỗi server" });
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
export const getOrdersByUserId = async (req, res) => {
    try {
        const orders = await OrderEntity.find({ userId: req.params.userId }).populate("paymentId").populate("status").sort({ createdAt: -1 });
        return res.json({ code: 0, data: orders.map(toOrderDTO) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
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
        if (((_a = order.status) === null || _a === void 0 ? void 0 : _a.toString()) === ORDER_STATUS.COMPLETED || ((_b = order.status) === null || _b === void 0 ? void 0 : _b.toString()) === ORDER_STATUS.CANCELLED) {
            return res.status(400).json({
                code: 1,
                message: "Đơn hàng đã hoàn tất hoặc đã hủy, không thể thay đổi trạng thái nữa"
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
        if (status.id === ORDER_STATUS.CANCELLED && order.userId && order.usedPoints > 0) {
            if (!order.pointsRefunded) {
                const user = await UserModel.findById(order.userId);
                if (user) {
                    user.membership.balancePoint += order.usedPoints;
                    await user.save();
                    order.pointsRefunded = true; // đánh dấu đã hoàn rồi
                }
            }
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
    var _a, _b, _c, _d;
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
    }
    user.membership.point = newPoint;
    user.membership.balancePoint = newBalancePoint;
    await user.save();
    return {
        level: user.membership.level,
        point: user.membership.point,
        balancePoint: user.membership.balancePoint,
        discountRate: user.membership.discountRate,
        levelChanged,
    };
};
export const getRewardHistoryByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        let { page = 1, limit = 10 } = req.query;
        const numPage = Number(page);
        const numLimit = Number(limit);
        // 👉 Lấy tất cả order có liên quan đến điểm
        const query = {
            userId,
            $or: [
                { "reward.points": { $gt: 0 } }, // có thưởng điểm
                { usedPoints: { $gt: 0 } }, // có sử dụng điểm
                { pointsRefunded: true } // có hoàn điểm
            ]
        };
        const result = await OrderEntity.paginate(query, {
            page: numPage,
            limit: numLimit,
            sort: { createdAt: -1 },
            populate: [
                { path: "paymentId", model: "Payment" },
                { path: "status", model: "OrderStatus" },
                { path: "transaction", model: "PaymentTransaction" }
            ]
        });
        const history = result.docs.map((order) => {
            let historyType = "";
            let points = 0;
            if (order.usedPoints > 0 && order.pointsRefunded) {
                historyType = "refunded"; // đã hoàn điểm
                points = order.usedPoints;
            }
            else if (order.usedPoints > 0) {
                historyType = "used"; // đã dùng điểm
                points = order.usedPoints;
            }
            else if (order.reward.points > 0 && order.reward.awarded) {
                historyType = "earned"; // đã được cộng điểm
                points = order.reward.points;
            }
            else if (order.reward.points > 0 && !order.reward.awarded) {
                historyType = "pending_reward"; // chờ cộng điểm
                points = order.reward.points;
            }
            else {
                historyType = "none"; // không có biến động điểm
            }
            return {
                orderId: order._id,
                code: order.code,
                createdAt: order.createdAt,
                historyType,
                points,
                order: toOrderDTO(order)
            };
        });
        return res.json({
            code: 0,
            data: history,
            pagination: {
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
                total: result.totalDocs
            }
        });
    }
    catch (err) {
        console.error("Lỗi getRewardHistoryByUserId:", err);
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const checkPoint = async (req, res) => {
    try {
        const { userId, usedPoint, orderTotal } = req.body;
        if (!userId || !usedPoint || !orderTotal) {
            return res.status(400).json({ success: false, message: "Thiếu dữ liệu" });
        }
        const user = await UserModel.findById(userId).select("membership.balancePoint");
        if (!user) {
            return res.status(404).json({ success: false, message: "Không tìm thấy user" });
        }
        const balancePoint = user.membership.balancePoint || 0;
        const maxPointAllow = Math.floor(orderTotal * 0.1); // toi da 10%
        if (usedPoint > balancePoint) {
            return res.json({
                code: 2,
                message: "Số điểm bạn có không đủ để sử dụng",
            });
        }
        if (usedPoint > maxPointAllow) {
            return res.json({
                code: 1,
                message: `Bạn chỉ được sử dụng tối đa ${maxPointAllow} điểm cho đơn hàng này`,
            });
        }
        return res.json({
            code: 0,
            data: { appliedPoint: usedPoint },
        });
    }
    catch (error) {
        return res.status(500).json({ success: false, message: "Lỗi server" });
    }
};
export const payWithSepay = async (req, res) => {
    var _a;
    try {
        const { orderId } = req.body;
        const order = await OrderEntity.findById(orderId).populate("paymentId");
        if (!order) {
            return res.status(404).json({ code: 1, message: "Không tìm thấy đơn hàng" });
        }
        // chỉ xử lý nếu chưa thanh toán
        // if (order.transaction && order.transaction.status === "success") {
        if (order.transaction) {
            return res.status(400).json({ code: 1, message: "Đơn hàng đã thanh toán rồi" });
        }
        const paymentData = await createSepayPayment({
            amount: order.totalPriceCurrent,
            description: `Thanh toán đơn hàng ${order.code}`,
            orderCode: order.code,
            returnUrl: `${process.env.APP_URL}/order-success?orderId=${order._id}`,
            cancelUrl: `${process.env.APP_URL}/order-failed?orderId=${order._id}`,
            callbackUrl: `${process.env.API_URL}/api/orders/sepay-callback`,
        });
        console.log("paymentData:", paymentData);
        return res.json({
            code: 0,
            message: "Tạo liên kết thanh toán thành công",
            data: {
                paymentUrl: (_a = paymentData.data) === null || _a === void 0 ? void 0 : _a.paymentUrl,
            }
        });
    }
    catch (err) {
        console.error("Lỗi payWithSepay:", err);
        return res.status(500).json({ code: 1, message: err.message || "Lỗi server" });
    }
};
export const sepayCallback = async (req, res) => {
    try {
        const { order_code, status, transaction_id, amount } = req.body;
        const order = await OrderEntity.findOne({ code: order_code });
        if (!order)
            return res.status(404).send("Order not found");
        if (status === "success") {
            const transaction = await PaymentTransactionEntity.create({
                orderId: order._id,
                amount,
                method: "bank_transfer",
                status: "success",
            });
            order.transaction = transaction._id;
            const completedStatus = await OrderStatusEntity.findOne({ id: ORDER_STATUS.COMPLETED });
            if (completedStatus)
                order.status = completedStatus._id;
        }
        else {
            const transaction = await PaymentTransactionEntity.create({
                orderId: order._id,
                transactionId: transaction_id,
                amount,
                method: "bank_transfer",
                status: "failed",
            });
            order.transaction = transaction._id;
            const cancelledStatus = await OrderStatusEntity.findOne({ id: ORDER_STATUS.CANCELLED });
            if (cancelledStatus)
                order.status = cancelledStatus._id;
        }
        await order.save();
        return res.status(200).send("OK");
    }
    catch (err) {
        console.error("Sepay callback error:", err);
        return res.status(500).send("Internal Server Error");
    }
};
//# sourceMappingURL=orderController.js.map