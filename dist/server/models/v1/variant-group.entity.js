import { Schema, model } from "mongoose";
const VariantItemSchema = new Schema({
    id: { type: String, required: true },
    name: { type: String, required: true, trim: true },
    isActive: { type: Boolean, default: true },
}, { _id: false });
const VariantGroupSchema = new Schema({
    groupName: { type: String, required: true, trim: true },
    groupType: { type: String, trim: true },
    description: { type: String, trim: true },
    icon: { type: String, trim: true },
    variants: { type: [VariantItemSchema], default: [] },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
export const VariantGroupEntity = model("VariantGroup", VariantGroupSchema, "variant_groups");
//# sourceMappingURL=variant-group.entity.js.map