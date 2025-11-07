import { PaymentTransactionEntity } from "../../../models/v1/payment-transaction.entity.js";
import { OrderEntity } from "../../../models/v1/order.entity.js";
import { toPaymentTransactionListDTO } from "../../../mappers/v1/payment-transaction.mapper.js";
export const createPaymentTransaction = async (req, res) => {
    try {
        const { orderId, amount, method } = req.body;
        if (!orderId || !amount || !method) {
            return res.status(400).json({ code: 1, message: "Thiếu dữ liệu bắt buộc" });
        }
        const existingTransaction = await PaymentTransactionEntity.findOne({ orderId });
        if (existingTransaction) {
            return res.status(400).json({
                code: 1,
                message: "Đơn hàng này đã có giao dịch thanh toán"
            });
        }
        const transaction = await PaymentTransactionEntity.create({
            orderId,
            amount,
            method,
            status: "pending"
        });
        await OrderEntity.findByIdAndUpdate(orderId, {
            transaction: transaction._id
        });
        res.json({
            code: 0,
            data: transaction,
            message: "Tạo giao dịch thành công"
        });
    }
    catch (err) {
        res.status(500).json({ code: 1, message: err.message });
    }
};
export const updatePaymentTransactionStatus = async (req, res) => {
    try {
        const { transactionId, status } = req.body;
        const transaction = await PaymentTransactionEntity.findByIdAndUpdate(transactionId, { status, updatedAt: new Date() }, { new: true });
        if (!transaction) {
            return res.status(404).json({ code: 1, message: "Không tìm thấy giao dịch" });
        }
        res.json({ code: 0, data: transaction, message: "Cập nhật trạng thái thành công" });
    }
    catch (err) {
        res.status(500).json({ code: 1, message: err.message });
    }
};
export const getPaymentTransactions = async (req, res) => {
    try {
        const { page = 1, limit = 10, status } = req.query;
        const query = {};
        if (status)
            query.status = status;
        const result = await PaymentTransactionEntity.paginate(query, {
            page: Number(page),
            limit: Number(limit),
            sort: { createdAt: -1 },
            populate: "orderId"
        });
        res.json({
            code: 0,
            data: toPaymentTransactionListDTO(result.docs),
            pagination: {
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
                total: result.totalDocs
            }
        });
    }
    catch (err) {
        res.status(500).json({ code: 1, message: err.message });
    }
};
export const deletePaymentTransaction = async (req, res) => {
    try {
        const { id } = req.params;
        const transaction = await PaymentTransactionEntity.findByIdAndDelete(id);
        if (!transaction)
            return res.status(404).json({ code: 1, message: "Không tìm thấy giao dịch" });
        res.json({ code: 0, message: "Xóa giao dịch thành công" });
    }
    catch (err) {
        res.status(500).json({ code: 1, message: err.message });
    }
};
export const getPaymentTransactionsByUserId = async (req, res) => {
    try {
        const { userId } = req.params;
        const { page = 1, limit = 10, status } = req.query;
        if (!userId)
            return res.status(400).json({ code: 1, message: "Thiếu userId" });
        // Tìm các order của user này
        const userOrders = await OrderEntity.find({ userId }).select("_id");
        const orderIds = userOrders.map(o => o._id);
        const query = { orderId: { $in: orderIds } };
        if (status)
            query.status = status;
        const result = await PaymentTransactionEntity.paginate(query, {
            page: Number(page),
            limit: Number(limit),
            sort: { createdAt: -1 },
            populate: "orderId"
        });
        res.json({
            code: 0,
            data: toPaymentTransactionListDTO(result.docs),
            pagination: {
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
                total: result.totalDocs
            }
        });
    }
    catch (err) {
        res.status(500).json({ code: 1, message: err.message });
    }
};
//# sourceMappingURL=payment-transaction.controller.js.map