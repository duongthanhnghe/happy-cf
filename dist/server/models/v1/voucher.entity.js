import { Schema, model } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import { VOUCHER_TYPE_LIST } from '../../shared/constants/voucher-type.js';
const VoucherSchema = new Schema({
    code: { type: String, required: true, unique: true }, // Mã voucher
    name: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    type: {
        type: String,
        required: true,
        enum: VOUCHER_TYPE_LIST,
    },
    value: { type: Number, default: 0 },
    maxDiscount: { type: Number },
    minOrderValue: { type: Number, default: 0 },
    maxShippingDiscount: { type: Number },
    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },
    limitPerUser: { type: Number, default: 0 },
    usedBy: [
        {
            userId: { type: Schema.Types.ObjectId, ref: "User" },
            count: { type: Number, default: 0 },
        },
    ],
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    applicableProducts: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    applicableCategories: [{ type: Schema.Types.ObjectId, ref: "CategoryProduct" }],
    stackable: { type: Boolean, default: false },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
VoucherSchema.plugin(mongoosePaginate);
export const VoucherEntity = model("Voucher", VoucherSchema, "vouchers");
//# sourceMappingURL=voucher.entity.js.map