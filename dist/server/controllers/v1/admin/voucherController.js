import { VoucherEntity } from "../../../models/v1/VoucherEntity.js";
import { toVoucherDTO } from "../../../mappers/v1/voucherMapper.js";
import { VoucherUsageEntity } from "../../../models/v1/VoucherUsageEntity.js";
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
export const applyVoucher123 = async (req, res) => {
    var _a;
    try {
        const { code, orderTotal, categoryIds = [], orderCreatedAt, userId } = req.body;
        if (!code || !orderTotal) {
            return res.status(400).json({ code: 1, message: "Thiếu mã voucher hoặc giá trị đơn hàng" });
        }
        if (!userId) {
            return res.status(400).json({ code: 1, message: "Thiếu thông tin người dùng" });
        }
        const voucher = await VoucherEntity.findOne({ code, isActive: true });
        if (!voucher) {
            return res.status(404).json({ code: 1, message: "Voucher không tồn tại" });
        }
        const now = new Date();
        // 1️⃣ Kiểm tra thời gian hợp lệ
        if (voucher.startDate > now) {
            return res.status(400).json({ code: 1, message: "Chưa đến thời gian áp dụng voucher" });
        }
        if (voucher.endDate < now) {
            return res.status(400).json({ code: 1, message: "Voucher đã hết hạn" });
        }
        // 2️⃣ Kiểm tra lượt tổng
        if (voucher.usageLimit > 0 && voucher.usedCount >= voucher.usageLimit) {
            return res.status(400).json({ code: 1, message: "Voucher đã hết lượt sử dụng" });
        }
        // 3️⃣ Kiểm tra lượt user
        const userUsedCount = await VoucherUsageEntity.countDocuments({
            voucherId: voucher._id,
            userId
        });
        if (voucher.limitPerUser > 0 && userUsedCount >= voucher.limitPerUser) {
            return res.status(400).json({ code: 1, message: "Bạn đã sử dụng hết số lượt của voucher này" });
        }
        // 4️⃣ Kiểm tra giá trị đơn tối thiểu
        if (voucher.minOrderValue && orderTotal < voucher.minOrderValue) {
            return res.status(400).json({
                code: 1,
                message: `Đơn hàng chưa đạt giá trị tối thiểu ${voucher.minOrderValue.toLocaleString()}đ để áp dụng voucher`
            });
        }
        // 5️⃣ Kiểm tra sản phẩm/danh mục áp dụng
        if (voucher.type === "product") {
            // const applicableProducts = (voucher.applicableProducts ?? []).map(p => p.toString())
            const applicableCategories = ((_a = voucher.applicableCategories) !== null && _a !== void 0 ? _a : []).map(c => c.toString());
            // const hasApplicableProduct = productIds.some((id: string) =>
            //   applicableProducts.includes(id.toString())
            // )
            const hasApplicableCategory = categoryIds.some((id) => applicableCategories.includes(id.toString()));
            if (!hasApplicableCategory) {
                return res.status(400).json({
                    code: 1,
                    message: "Voucher không áp dụng cho sản phẩm hoặc danh mục trong đơn hàng"
                });
            }
        }
        // 6️⃣ Tính giảm giá
        let discount = 0;
        let message = "Áp dụng voucher thành công";
        switch (voucher.type) {
            case "percentage":
                discount = Math.min((orderTotal * voucher.value) / 100, voucher.maxDiscount || Infinity);
                break;
            case "fixed":
                discount = Math.min(voucher.value, orderTotal);
                break;
            case "freeship":
                if (!voucher.maxShippingDiscount || voucher.maxShippingDiscount <= 0) {
                    return res.status(400).json({
                        code: 1,
                        message: "Voucher freeship chưa có cấu hình mức giảm phí vận chuyển tối đa"
                    });
                }
                discount = Math.min(voucher.maxShippingDiscount, orderTotal);
                message = `Áp dụng miễn phí vận chuyển (tối đa ${voucher.maxShippingDiscount.toLocaleString()}đ)`;
                break;
            case "product":
                discount = Math.min(voucher.value, orderTotal);
                break;
            case "timed":
                if (!orderCreatedAt) {
                    return res.status(400).json({ code: 1, message: "Thiếu thời gian tạo đơn hàng" });
                }
                const createdAt = new Date(orderCreatedAt);
                if (createdAt < voucher.startDate || createdAt > voucher.endDate) {
                    return res.status(400).json({ code: 1, message: "Voucher không còn hiệu lực tại thời điểm này" });
                }
                discount = Math.min((orderTotal * voucher.value) / 100, voucher.maxDiscount || Infinity);
                message = "Áp dụng voucher khung thời gian";
                break;
            default:
                return res.status(400).json({ code: 1, message: "Loại voucher không hợp lệ" });
        }
        // ✅ Trả kết quả
        return res.json({
            code: 0,
            message,
            data: {
                code: voucher.code,
                type: voucher.type,
                discount,
                stackable: voucher.stackable,
                expiresAt: voucher.endDate,
            }
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const applyVoucher = async (req, res) => {
    var _a, _b;
    try {
        const { code, orderTotal, products = [], orderCreatedAt, userId, } = req.body;
        if (!code || !orderTotal)
            return res.status(400).json({ code: 1, message: "Thiếu mã voucher hoặc giá trị đơn hàng" });
        if (!userId)
            return res.status(400).json({ code: 1, message: "Thiếu thông tin người dùng" });
        const voucher = await VoucherEntity.findOne({ code, isActive: true });
        if (!voucher)
            return res.status(404).json({ code: 1, message: "Voucher không tồn tại hoặc không hoạt động" });
        const now = new Date();
        // 1️⃣ Kiểm tra hiệu lực thời gian
        if (voucher.startDate > now)
            return res.status(400).json({ code: 1, message: "Chưa đến thời gian áp dụng voucher" });
        if (voucher.endDate < now)
            return res.status(400).json({ code: 1, message: "Voucher đã hết hạn" });
        // 2️⃣ Kiểm tra lượt sử dụng
        if (voucher.usageLimit > 0 && voucher.usedCount >= voucher.usageLimit)
            return res.status(400).json({ code: 1, message: "Voucher đã hết lượt sử dụng" });
        const userUsedCount = await VoucherUsageEntity.countDocuments({
            voucherId: voucher._id,
            userId,
        });
        if (voucher.limitPerUser > 0 && userUsedCount >= voucher.limitPerUser)
            return res.status(400).json({ code: 1, message: "Bạn đã dùng hết lượt của voucher này" });
        // 3️⃣ Kiểm tra giá trị đơn tối thiểu
        if (voucher.minOrderValue && orderTotal < voucher.minOrderValue)
            return res.status(400).json({
                code: 1,
                message: `Đơn hàng chưa đạt giá trị tối thiểu ${voucher.minOrderValue.toLocaleString()}đ`,
            });
        // 4️⃣ Lọc sản phẩm hợp lệ theo danh mục hoặc danh sách sản phẩm
        let applicableProducts = [];
        if (voucher.type === "product") {
            if (voucher.value < 0 || voucher.value > 100) {
                return res.status(400).json({ code: 1, message: "Giá trị giảm (%) không hợp lệ" });
            }
            const applicableProductIds = ((_a = voucher.applicableProducts) !== null && _a !== void 0 ? _a : []).map(String);
            const applicableCategoryIds = ((_b = voucher.applicableCategories) !== null && _b !== void 0 ? _b : []).map(String);
            applicableProducts = products.filter((p) => {
                var _a, _b;
                const pid = (_a = p.productId) === null || _a === void 0 ? void 0 : _a.toString();
                const cid = (_b = p.categoryId) === null || _b === void 0 ? void 0 : _b.toString();
                return (applicableProductIds.includes(pid) ||
                    applicableCategoryIds.includes(cid));
            });
            if (applicableProducts.length === 0) {
                return res.status(400).json({
                    code: 1,
                    message: "Voucher không áp dụng cho sản phẩm nào trong đơn hàng",
                });
            }
        }
        else {
            // Nếu không phải voucher sản phẩm, áp dụng toàn bộ đơn
            applicableProducts = products;
        }
        // 5️⃣ Tính giảm giá
        const subtotalApplicable = applicableProducts.reduce((sum, p) => sum + p.price * p.quantity, 0);
        let discount = 0;
        let message = "Áp dụng voucher thành công";
        switch (voucher.type) {
            case "percentage":
                discount = Math.min((subtotalApplicable * voucher.value) / 100, voucher.maxDiscount || Infinity);
                break;
            case "fixed":
                discount = Math.min(voucher.value, subtotalApplicable);
                break;
            case "freeship":
                if (!voucher.maxShippingDiscount)
                    return res.status(400).json({
                        code: 1,
                        message: "Voucher freeship chưa cấu hình mức giảm phí tối đa",
                    });
                discount = Math.min(voucher.maxShippingDiscount, orderTotal);
                message = `Áp dụng miễn phí vận chuyển (tối đa ${voucher.maxShippingDiscount.toLocaleString()}đ)`;
                break;
            case "product":
                discount = Math.min((subtotalApplicable * voucher.value) / 100, voucher.maxDiscount || Infinity);
                const productNames = applicableProducts.map((p) => p.productName);
                if (productNames.length === 1) {
                    message = `Mã giảm giá ${voucher.code} chỉ áp dụng giảm ${voucher.value}% cho sản phẩm ${productNames[0]}`;
                }
                else {
                    message = `Mã giảm giá ${voucher.code} chỉ áp dụng giảm ${voucher.value}% cho ${productNames.length} sản phẩm: ${productNames
                        .map(name => `<div>- ${name}</div>`)
                        .join("")}`;
                }
                break;
            case "timed":
                if (!orderCreatedAt)
                    return res.status(400).json({ code: 1, message: "Thiếu thời gian tạo đơn hàng" });
                const createdAt = new Date(orderCreatedAt);
                if (createdAt < voucher.startDate || createdAt > voucher.endDate)
                    return res.status(400).json({ code: 1, message: "Voucher không hợp lệ ở thời điểm này" });
                discount = Math.min((subtotalApplicable * voucher.value) / 100, voucher.maxDiscount || Infinity);
                message = "Áp dụng voucher khung thời gian";
                break;
            default:
                return res.status(400).json({ code: 1, message: "Loại voucher không hợp lệ" });
        }
        // Làm tròn 2 chữ số
        discount = Math.round(discount * 1000) / 1000;
        // ✅ Trả kết quả
        return res.json({
            code: 0,
            message,
            data: {
                code: voucher.code,
                type: voucher.type,
                discount,
                applicableProducts,
                stackable: voucher.stackable,
                expiresAt: voucher.endDate,
            },
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getAvailableVouchersForOrder = async (req, res) => {
    var _a;
    try {
        const { orderTotal = 0, categoryIds = [], userId } = req.body;
        const now = new Date();
        // 📍 Lọc voucher hợp lệ theo thời gian & trạng thái
        const vouchers = await VoucherEntity.find({
            isActive: true,
            startDate: { $lte: now },
            endDate: { $gte: now },
        }).sort({ createdAt: -1 });
        const result = [];
        for (const v of vouchers) {
            // ✅ Đếm số lần user đã dùng voucher này
            const userUsedCount = userId
                ? await VoucherUsageEntity.countDocuments({
                    voucherId: v._id,
                    userId,
                })
                : 0;
            let isDisabled = false;
            let disabledReason = null;
            // 🔹 1. Hết lượt tổng
            if (v.usageLimit > 0 && v.usedCount >= v.usageLimit) {
                isDisabled = true;
                disabledReason = "Voucher đã hết lượt sử dụng";
            }
            // 🔹 2. Hết lượt với người dùng
            else if (v.limitPerUser > 0 && userUsedCount >= v.limitPerUser) {
                isDisabled = true;
                disabledReason = "Bạn đã sử dụng hết số lượt của voucher này";
            }
            // 🔹 3. Đơn hàng chưa đạt giá trị tối thiểu
            else if (orderTotal < (v.minOrderValue || 0)) {
                isDisabled = true;
                disabledReason = `Đơn hàng chưa đạt giá trị tối thiểu ${(_a = v.minOrderValue) === null || _a === void 0 ? void 0 : _a.toLocaleString()}đ`;
            }
            // 🔹 4. Không áp dụng cho sản phẩm trong đơn hàng
            else if (v.type === "product") {
                // const hasApplicableProducts =
                //   Array.isArray(v.applicableProducts) &&
                //   productIds.some((id: string) =>
                //     v.applicableProducts.map(String).includes(id.toString())
                //   )
                const hasApplicableCategories = Array.isArray(v.applicableCategories) &&
                    Array.isArray(categoryIds) &&
                    categoryIds.some((cid) => { var _a; return ((_a = v.applicableCategories) !== null && _a !== void 0 ? _a : []).map(String).includes(cid.toString()); });
                if (!hasApplicableCategories) {
                    isDisabled = true;
                    disabledReason = "Không áp dụng cho sản phẩm hoặc danh mục trong đơn hàng";
                }
            }
            result.push({
                ...v.toObject(),
                isDisabled,
                disabledReason,
            });
        }
        return res.json({
            code: 0,
            message: "Lấy danh sách voucher thành công",
            data: result,
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
//# sourceMappingURL=voucherController.js.map