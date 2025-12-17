import mongoose from "mongoose";
import { VoucherUsageEntity } from "../../../models/v1/voucher-usage.entity.js";
export const getAllVoucherUsage = async (req, res) => {
    try {
        let { page = 1, limit = 10, userId, code, orderId, reverted, type, fromDate, toDate, } = req.query;
        const numPage = Number(page);
        const numLimit = Number(limit);
        const skip = (numPage - 1) * numLimit;
        const filter = {};
        if (userId) {
            filter.userId = new mongoose.Types.ObjectId(userId);
        }
        if (orderId) {
            filter.orderId = new mongoose.Types.ObjectId(orderId);
        }
        if (reverted !== undefined) {
            filter.reverted = reverted === "true";
        }
        // 🔍 Tìm theo code (LIKE)
        if (code) {
            filter.code = { $regex: code, $options: "i" };
        }
        // 🧩 Filter theo loại voucher
        if (type) {
            filter.type = type;
        }
        // 📅 Filter theo khoảng thời gian usedAt
        if (fromDate || toDate) {
            filter.usedAt = {};
            if (fromDate) {
                filter.usedAt.$gte = new Date(fromDate);
            }
            if (toDate) {
                const endDate = new Date(toDate);
                endDate.setHours(23, 59, 59, 999); // lấy hết ngày
                filter.usedAt.$lte = endDate;
            }
        }
        const [list, total] = await Promise.all([
            VoucherUsageEntity.find(filter)
                .populate("voucherId", "code name type value")
                .populate("userId", "fullname phone email")
                .populate("orderId", "code totalPrice")
                .sort({ usedAt: -1 })
                .skip(skip)
                .limit(numLimit),
            VoucherUsageEntity.countDocuments(filter),
        ]);
        return res.json({
            code: 0,
            data: list,
            pagination: {
                page: numPage,
                limit: numLimit,
                total,
                totalPages: Math.ceil(total / numLimit),
            },
        });
    }
    catch (err) {
        console.error("getAllVoucherUsage error:", err);
        return res.status(500).json({
            code: 1,
            message: "Lỗi lấy danh sách lịch sử sử dụng voucher",
        });
    }
};
//# sourceMappingURL=voucher-usage.controller.js.map