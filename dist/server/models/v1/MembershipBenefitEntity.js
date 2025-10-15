import { Schema, model } from "mongoose";
const MembershipBenefitSchema = new Schema({
    name: { type: String, required: true, unique: true },
    description: { type: String },
    icon: { type: String },
}, { timestamps: true });
export const MembershipBenefitModel = model("MembershipBenefit", MembershipBenefitSchema, "membership_benefits");
//# sourceMappingURL=MembershipBenefitEntity.js.map