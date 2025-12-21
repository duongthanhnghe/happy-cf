import { UserModel } from "../../../models/v1/user.entity.js";
import { OrderEntity, OrderStatusEntity, PaymentEntity } from "../../../models/v1/order.entity.js";
import { MembershipLevelModel } from "../../../models/v1/membership-level.entity.js";
import { toOrderDTO, toOrderListDTO, toOrderStatusListDTO, toPaymentListDTO } from "../../../mappers/v1/order.mapper.js";
import { ORDER_STATUS } from "../../../shared/constants/order-status.js";
import { ProductReviewEntity } from "../../../models/v1/product-review.entity.js";
import { VoucherEntity } from "../../../models/v1/voucher.entity.js";
import { VoucherUsageEntity } from "../../../models/v1/voucher-usage.entity.js";
import mongoose from "mongoose";
import { restoreStockOrder } from "../../../utils/restoreStockOrder.js";
export const getAllOrder = async (req, res) => {
    try {
        let { page = 1, limit = 10, fromDate, toDate, search, statusId, transactionId } = req.query;
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
                { path: "cartItems.idProduct", model: "Product", select: "image productName" }
            ]
        };
        let result = await OrderEntity.paginate(filter, options);
        if (transactionId) {
            result.docs = result.docs.filter(doc => doc.transaction !== null);
        }
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
// export const getAllOrder = async (req: Request, res: Response) => {
//   try {
//     let {
//       page = 1,
//       limit = 10,
//       fromDate,
//       toDate,
//       search,
//       statusId,
//       transactionId,
//     } = req.query;
//     const numPage = Number(page);
//     const numLimit = Number(limit);
//     const preMatch: any = {};
//     const postMatch: any = {};
//     // --------------------------
//     // PRE-MATCH
//     // --------------------------
//     if (fromDate || toDate) {
//       preMatch.createdAt = {};
//       if (fromDate) preMatch.createdAt.$gte = new Date(fromDate as string);
//       if (toDate) {
//         const end = new Date(toDate as string);
//         end.setHours(23, 59, 59, 999);
//         preMatch.createdAt.$lte = end;
//       }
//     }
//     if (search) {
//       const keyword = search.toString().trim();
//       preMatch.$or = [
//         { code: { $regex: keyword, $options: "i" } },
//         { phone: { $regex: keyword, $options: "i" } },
//         { fullname: { $regex: keyword, $options: "i" } },
//       ];
//     }
//     if (statusId) {
//       preMatch.status = new mongoose.Types.ObjectId(statusId as string);
//     }
//     if (transactionId) {
//       postMatch["transactionData.status"] = transactionId;
//     }
//     // --------------------------
//     // AGGREGATE PIPELINE
//     // --------------------------
//     const pipeline: any[] = [];
//     if (Object.keys(preMatch).length) pipeline.push({ $match: preMatch });
//     // --------------------------
//     // POPULATE: Status
//     // --------------------------
//     pipeline.push(
//       {
//         $lookup: {
//           from: "order_status",
//           localField: "status",
//           foreignField: "_id",
//           as: "statusData",
//         },
//       },
//       { $unwind: "$statusData" }
//     );
//     // --------------------------
//     // POPULATE: Payment
//     // --------------------------
//     pipeline.push(
//       {
//         $lookup: {
//           from: "payments",
//           localField: "paymentId",
//           foreignField: "_id",
//           as: "paymentData",
//         },
//       },
//       { $unwind: "$paymentData" }
//     );
//     // --------------------------
//     // POPULATE: User
//     // --------------------------
//     pipeline.push(
//       {
//         $lookup: {
//           from: "users",
//           localField: "userId",
//           foreignField: "_id",
//           as: "userData",
//         },
//       },
//       {
//         $unwind: {
//           path: "$userData",
//           preserveNullAndEmptyArrays: true,
//         },
//       }
//     );
//     // --------------------------
//     // POPULATE: Payment Transaction
//     // --------------------------
//     pipeline.push(
//       {
//         $lookup: {
//           from: "paymenttransactions",
//           localField: "transaction",
//           foreignField: "_id",
//           as: "transactionData",
//         },
//       },
//       {
//         $unwind: {
//           path: "$transactionData",
//           preserveNullAndEmptyArrays: true,
//         },
//       }
//     );
//     // Apply post-match
//     if (Object.keys(postMatch).length) pipeline.push({ $match: postMatch });
//     // --------------------------
//     // POPULATE: Product (image, productName)
//     // --------------------------
//     pipeline.push({
//       $lookup: {
//         from: "products",
//         localField: "cartItems.idProduct",
//         foreignField: "_id",
//         as: "productData",
//       },
//     });
//     // --------------------------
//     // Merge product vào cartItems
//     // --------------------------
//     pipeline.push({
//       $addFields: {
//         cartItems: {
//           $map: {
//             input: "$cartItems",
//             as: "ci",
//             in: {
//               $mergeObjects: [
//                 "$$ci",
//                 {
//                   product: {
//                     $first: {
//                       $filter: {
//                         input: "$productData",
//                         as: "pd",
//                         cond: { $eq: ["$$pd._id", "$$ci.idProduct"] },
//                       },
//                     },
//                   },
//                 },
//               ],
//             },
//           },
//         },
//       },
//     });
//     pipeline.push({ $project: { productData: 0 } });
//     // SORT
//     pipeline.push({ $sort: { createdAt: -1 } });
//     // FACET: data + total
//     pipeline.push({
//       $facet: {
//         data: [
//           ...(numLimit === -1
//             ? []
//             : [
//                 { $skip: (numPage - 1) * numLimit },
//                 { $limit: numLimit },
//               ]),
//         ],
//         totalCount: [{ $count: "total" }],
//       },
//     });
//     // EXECUTE DB
//     const result = await OrderEntity.aggregate(pipeline);
//     const data = result[0]?.data || [];
//     const total = result[0]?.totalCount?.[0]?.total || 0;
//     return res.json({
//       code: 0,
//       data: toOrderListDTO(data),
//       pagination: {
//         page: numPage,
//         limit: numLimit,
//         total,
//         totalPages: numLimit === -1 ? 1 : Math.ceil(total / numLimit),
//       },
//     });
//   } catch (error) {
//     return res.status(500).json({
//       code: 1,
//       message: "Lỗi lấy danh sách order",
//       error,
//     });
//   }
// };
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
        if (status.id === ORDER_STATUS.CANCELLED && order.userId) {
            // hoàn kho
            await restoreStockOrder(order);
            order.stockDeducted = false;
            // hoàn voucher
            await rollbackVoucherUsage(order);
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
//# sourceMappingURL=order.controller.js.map