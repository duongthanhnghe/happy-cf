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
    usedAt: {
        type: Date,
        default: Date.now,
    },
}, { timestamps: true });
export const VoucherUsageEntity = model("VoucherUsage", VoucherUsageSchema);
//# sourceMappingURL=VoucherUsageEntity.js.map