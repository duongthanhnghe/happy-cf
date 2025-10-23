import { VoucherEntity } from "../../../models/v1/VoucherEntity.js";
import { toVoucherDTO } from "../../../mappers/v1/voucherMapper.js";
// 📍 Lấy danh sách voucher
export const getAllVouchers = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        const numPage = Number(page);
        const numLimit = Number(limit);
        // Nếu limit = -1 → lấy toàn bộ
        if (numLimit === -1) {
            const vouchers = await VoucherEntity.find().sort({ createdAt: -1 });
            return res.json({
                code: 0,
                data: vouchers.map(toVoucherDTO),
                pagination: {
                    page: 1,
                    limit: vouchers.length,
                    totalPages: 1,
                    total: vouchers.length
                }
            });
        }
        // Cấu hình phân trang
        const options = {
            page: numPage,
            limit: numLimit,
            sort: { createdAt: -1 }
        };
        const result = await VoucherEntity.paginate({}, options);
        return res.json({
            code: 0,
            data: result.docs.map(toVoucherDTO),
            pagination: {
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
                total: result.totalDocs
            }
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: "Lỗi lấy danh sách voucher", error: err.message });
    }
};
// 📍 Lấy voucher theo ID
export const getVoucherById = async (req, res) => {
    try {
        const voucher = await VoucherEntity.findById(req.params.id);
        if (!voucher) {
            return res.status(404).json({ code: 1, message: "Voucher không tồn tại" });
        }
        return res.json({ code: 0, data: toVoucherDTO(voucher) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
// 📍 Tạo mới voucher
export const createVoucher = async (req, res) => {
    try {
        const exists = await VoucherEntity.findOne({ code: req.body.code });
        if (exists) {
            return res.status(400).json({ code: 1, message: "Mã voucher đã tồn tại" });
        }
        const voucher = new VoucherEntity(req.body);
        await voucher.save();
        return res.json({
            code: 0,
            message: "Tạo voucher thành công",
            data: toVoucherDTO(voucher)
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
// 📍 Cập nhật voucher
export const updateVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        const updateData = req.body;
        const voucher = await VoucherEntity.findById(id);
        if (!voucher) {
            return res.status(404).json({ code: 1, message: "Voucher không tồn tại" });
        }
        const now = new Date();
        // Voucher đã hết hạn
        if (voucher.endDate < now) {
            return res.status(400).json({ code: 1, message: "Voucher đã hết hạn, không thể cập nhật" });
        }
        // Nếu voucher đang hoạt động hoặc đã có người dùng → hạn chế update
        if (voucher.usedCount > 0 || (voucher.startDate <= now && voucher.endDate >= now)) {
            const allowedFields = ["isActive", "name", "description"];
            const filteredData = Object.keys(updateData)
                .filter((k) => allowedFields.includes(k))
                .reduce((obj, key) => {
                obj[key] = updateData[key];
                return obj;
            }, {});
            const updated = await VoucherEntity.findByIdAndUpdate(id, filteredData, { new: true });
            return res.json({
                code: 0,
                message: "Cập nhật thành công",
                data: toVoucherDTO(updated)
            });
        }
        // Nếu chưa bắt đầu → cho cập nhật toàn bộ
        const updated = await VoucherEntity.findByIdAndUpdate(id, updateData, { new: true });
        return res.json({
            code: 0,
            message: "Cập nhật voucher thành công",
            data: toVoucherDTO(updated)
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
// 📍 Xóa voucher
export const deleteVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        const voucher = await VoucherEntity.findById(id);
        if (!voucher) {
            return res.status(404).json({ code: 1, message: "Voucher không tồn tại" });
        }
        const now = new Date();
        if (voucher.usedCount > 0 || voucher.startDate <= now) {
            // Chỉ vô hiệu hóa thay vì xóa
            voucher.isActive = false;
            await voucher.save();
            return res.json({
                code: 0,
                message: "Voucher đã được sử dụng hoặc đang hoạt động — chuyển sang trạng thái vô hiệu hóa"
            });
        }
        // Có thể xóa hẳn
        await VoucherEntity.findByIdAndDelete(id);
        return res.json({ code: 0, message: "Xóa voucher thành công" });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const toggleActiveVoucher = async (req, res) => {
    try {
        const { id } = req.params;
        const voucher = await VoucherEntity.findById(id);
        if (!voucher) {
            return res.status(404).json({ code: 1, message: "Voucher không tồn tại" });
        }
        const now = new Date();
        // Voucher đã hết hạn thì không thể bật lại
        if (voucher.endDate < now) {
            return res.status(400).json({
                code: 1,
                message: "Voucher đã hết hạn, không thể thay đổi trạng thái",
            });
        }
        // Đảo trạng thái hoạt động
        voucher.isActive = !voucher.isActive;
        await voucher.save();
        return res.json({
            code: 0,
            message: "Cập nhật trạng thái hoạt động thành công",
            data: toVoucherDTO(voucher),
        });
    }
    catch (err) {
        return res.status(500).json({
            code: 1,
            message: err.message || "Lỗi khi cập nhật trạng thái voucher",
        });
    }
};
// 📍 Áp dụng voucher để tính giảm giá
export const applyVoucher = async (req, res) => {
    var _a;
    try {
        const { code, orderTotal, productIds, orderCreatedAt } = req.body;
        if (!code || !orderTotal) {
            return res.status(400).json({
                code: 1,
                message: "Thiếu mã voucher hoặc giá trị đơn hàng",
            });
        }
        const voucher = await VoucherEntity.findOne({ code, isActive: true });
        if (!voucher) {
            return res.status(404).json({ code: 1, message: "Voucher không tồn tại" });
        }
        const now = new Date();
        if (voucher.startDate > now || voucher.endDate < now) {
            return res.status(400).json({ code: 1, message: "Voucher đã hết hạn" });
        }
        if (voucher.usageLimit > 0 && voucher.usedCount >= voucher.usageLimit) {
            return res.status(400).json({ code: 1, message: "Voucher đã hết lượt sử dụng" });
        }
        if (voucher.minOrderValue && orderTotal < voucher.minOrderValue) {
            return res.status(400).json({
                code: 1,
                message: `Đơn hàng chưa đạt giá trị tối thiểu ${voucher.minOrderValue.toLocaleString()}đ để áp dụng voucher`,
            });
        }
        let discount = 0;
        let message = "Áp dụng voucher thành công";
        // ========== TYPE XỬ LÝ ==========
        switch (voucher.type) {
            // 1️⃣ Giảm phần trăm tổng đơn
            case "percentage":
                discount = Math.min((orderTotal * voucher.value) / 100, voucher.maxDiscount || Infinity);
                break;
            // 2️⃣ Giảm số tiền cố định
            case "fixed":
                discount = Math.min(voucher.value, orderTotal);
                break;
            // 3️⃣ Miễn phí vận chuyển (tối đa X VNĐ)
            case "freeship":
                if (!voucher.maxShippingDiscount || voucher.maxShippingDiscount <= 0) {
                    return res.status(400).json({
                        code: 1,
                        message: "Voucher freeship chưa có cấu hình mức giảm phí vận chuyển tối đa",
                    });
                }
                discount = Math.min(voucher.maxShippingDiscount, orderTotal);
                message = `Áp dụng miễn phí vận chuyển (tối đa ${voucher.maxShippingDiscount.toLocaleString()}đ)`;
                break;
            // 4️⃣ Giảm giá theo sản phẩm cụ thể
            case "product":
                if (!productIds || !Array.isArray(productIds) || productIds.length === 0) {
                    return res.status(400).json({ code: 1, message: "Thiếu danh sách sản phẩm trong đơn hàng" });
                }
                const applicable = ((_a = voucher.applicableProducts) === null || _a === void 0 ? void 0 : _a.map(p => p.toString())) || [];
                const matched = productIds.filter(id => applicable.includes(id.toString()));
                if (matched.length === 0) {
                    return res.status(400).json({
                        code: 1,
                        message: "Voucher này chỉ áp dụng cho sản phẩm cụ thể",
                    });
                }
                discount = Math.min(voucher.value * matched.length, orderTotal);
                message = `Giảm giá cho ${matched.length} sản phẩm áp dụng`;
                break;
            // 5️⃣ Giảm giá trong khung giờ/khung thời gian đặc biệt
            case "timed":
                if (!orderCreatedAt) {
                    return res.status(400).json({
                        code: 1,
                        message: "Thiếu thời gian tạo đơn để kiểm tra voucher thời gian",
                    });
                }
                const createdAt = new Date(orderCreatedAt);
                if (createdAt < voucher.startDate || createdAt > voucher.endDate) {
                    return res.status(400).json({
                        code: 1,
                        message: "Voucher chỉ áp dụng trong khung thời gian nhất định",
                    });
                }
                // Áp dụng như fixed/percentage tùy config
                discount = Math.min((orderTotal * voucher.value) / 100, voucher.maxDiscount || Infinity);
                message = "Áp dụng voucher khung thời gian";
                break;
            default:
                return res.status(400).json({ code: 1, message: "Loại voucher không hợp lệ" });
        }
        // ========== TRẢ KẾT QUẢ ==========
        return res.json({
            code: 0,
            message,
            data: {
                code: voucher.code,
                type: voucher.type,
                discount,
                stackable: voucher.stackable,
                expiresAt: voucher.endDate,
            },
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
//# sourceMappingURL=voucherController.js.map