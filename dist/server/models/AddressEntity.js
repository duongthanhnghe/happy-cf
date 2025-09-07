import { Schema, model } from "mongoose";
const AddressSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
    fullname: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    note: { type: String },
    tag: {
        type: String,
        enum: ["Nhà", "Công ty", "Trường học", "Khác"],
        default: "Khác"
    },
    isDefault: { type: Boolean, default: false },
}, { timestamps: true });
export const AddressModel = model("Address", AddressSchema, "addresses");
//# sourceMappingURL=AddressEntity.js.map