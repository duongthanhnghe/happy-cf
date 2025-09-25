import { UserModel } from "../models/UserEntity.js";
import { OrderEntity, OrderStatusEntity, PaymentEntity } from "../models/OrderEntity.js";
import { MembershipLevelModel } from "../models/MembershipLevelEntity.js";
import { toOrderDTO, toOrderListDTO, toOrderStatusListDTO, toPaymentListDTO } from "../mappers/orderMapper.js";
import { ORDER_STATUS } from "../shared/constants/order-status.js";
import { ProductReviewEntity } from "../models/ProductReviewEntity.js";
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
        const { data, userId, point } = req.body;
        if (!(data === null || data === void 0 ? void 0 : data.fullname) || !(data === null || data === void 0 ? void 0 : data.phone) || !(data === null || data === void 0 ? void 0 : data.paymentId) || !(data === null || data === void 0 ? void 0 : data.cartItems)) {
            return res.status(400).json({ code: 1, message: "Dữ liệu đơn hàng không hợp lệ" });
        }
        const newOrder = await OrderEntity.create({
            ...data,
            userId,
            reward: { points: point || 0, awarded: false }
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
        order.status = statusId;
        // Nếu status = COMPLETED → tạo danh sách đánh giá
        if (status.id === ORDER_STATUS.COMPLETED && order.userId) {
            console.log(order.cartItems);
            const existingReviews = await ProductReviewEntity.find({ orderId: orderId });
            if (existingReviews.length === 0) {
                const reviews = order.cartItems.map((item) => ({
                    orderId: orderId,
                    userId: order.userId,
                    productId: item.idProduct,
                    rating: 0, // Mặc định chưa có đánh giá
                    comment: null,
                    images: [],
                    status: "pending", // Trạng thái mặc định là pending
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
    var _a, _b;
    const user = await UserModel.findById(userId);
    if (!user)
        return null;
    const levels = await MembershipLevelModel.find();
    const newPoint = (((_a = user.membership) === null || _a === void 0 ? void 0 : _a.point) || 0) + point;
    const newLevel = levels
        .filter((level) => newPoint >= level.minPoint)
        .sort((a, b) => b.minPoint - a.minPoint)[0];
    const levelChanged = newLevel && ((_b = user.membership) === null || _b === void 0 ? void 0 : _b.level) !== newLevel.name;
    if (newLevel)
        user.membership.level = newLevel.name;
    user.membership.point = newPoint;
    await user.save();
    return {
        level: user.membership.level,
        point: user.membership.point,
        levelChanged,
    };
};
export const getRewardHistoryByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        let { page = 1, limit = 10 } = req.query;
        const numPage = Number(page);
        const numLimit = Number(limit);
        const query = {
            userId,
            "reward.awarded": true,
            "reward.points": { $gt: 0 }
        };
        const result = await OrderEntity.paginate(query, {
            page: numPage,
            limit: numLimit,
            sort: { "reward.awardedAt": -1 },
            populate: [
                { path: "paymentId", model: "Payment" },
                { path: "status", model: "OrderStatus" },
                { path: "transaction", model: "PaymentTransaction" }
            ]
        });
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
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
//# sourceMappingURL=orderController.js.map