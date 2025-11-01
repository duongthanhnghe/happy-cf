import { Schema, model } from "mongoose";
import "./MembershipBenefitEntity.js";
const MembershipLevelSchema = new Schema({
    name: { type: String, required: true, unique: true },
    minPoint: { type: Number, required: true },
    icon: { type: String },
    image: { type: String },
    discountRate: { type: Number },
    pointRate: { type: Number, default: 2 },
    benefits: [{ type: Schema.Types.ObjectId, ref: "MembershipBenefit" }]
}, { timestamps: false });
export const MembershipLevelModel = model("MembershipLevel", MembershipLevelSchema, "membership_levels");
//# sourceMappingURL=MembershipLevelEntity.js.map