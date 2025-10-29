import { Schema, model, Types } from "mongoose";
import { VOUCHER_TYPE_LIST } from '../../shared/constants/voucher-type.js';
export const VoucherUsageOrderSchema = new Schema({
    code: { type: String, required: true },
    type: {
        type: String,
        enum: VOUCHER_TYPE_LIST,
        required: true
    },
    discount: { type: Number, default: 0 },
    applicableProducts: [
        {
            productId: { type: Schema.Types.ObjectId, ref: 'Product' },
            name: { type: String },
            categoryId: { type: Schema.Types.ObjectId, ref: 'CategoryProduct' },
            price: { type: Number },
            quantity: { type: Number },
        },
    ],
    expiresAt: { type: Date },
    stackable: { type: Boolean, default: false },
}, { _id: false });
const VoucherUsageSchema = new Schema({
    voucherId: {
        type: Types.ObjectId,
        ref: "Voucher",
        required: true,
    },
    userId: {
        type: Types.ObjectId,
        ref: "User",
        required: true,
    },
    orderId: {
        type: Types.ObjectId,
        ref: "Order",
    },
    code: { type: String, required: true },
    type: { type: String, enum: VOUCHER_TYPE_LIST, required: true },
    discount: { type: Number, default: 0 },
    // 💡 Lưu danh sách sản phẩm hoặc danh mục mà voucher này đã áp dụng
    applicableProducts: [
        {
            productId: { type: Schema.Types.ObjectId, ref: "Product" },
            name: String,
            categoryId: { type: Schema.Types.ObjectId, ref: "CategoryProduct" },
            price: Number,
            quantity: Number,
        },
    ],
    // 💡 Ngày voucher hết hạn (để biết voucher còn hiệu lực không lúc áp dụng)
    expiresAt: { type: Date },
    // 💡 Cho biết voucher có thể cộng dồn không
    stackable: { type: Boolean, default: false },
    // 💡 Thời gian dùng voucher
    usedAt: { type: Date, default: Date.now },
    // 💡 Ghi chú chi tiết
    meta: {
        ip: String, // IP người dùng lúc đặt hàng
        userAgent: String, // trình duyệt
    },
    reverted: { type: Boolean, default: false },
    revertedAt: { type: Date },
}, { timestamps: true });
export const VoucherUsageEntity = model("VoucherUsage", VoucherUsageSchema);
//# sourceMappingURL=VoucherUsageEntity.js.map