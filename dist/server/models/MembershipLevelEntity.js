import { Schema, model } from "mongoose";
import "./MembershipBenefitEntity.js";
const MembershipLevelSchema = new Schema({
    name: { type: String, required: true, unique: true },
    minPoint: { type: Number, required: true },
    icon: { type: String },
    image: { type: String },
    benefits: [{ type: Schema.Types.ObjectId, ref: "MembershipBenefit" }]
}, { timestamps: false });
export const MembershipLevelModel = model("MembershipLevel", MembershipLevelSchema, "membership_levels");
//# sourceMappingURL=MembershipLevelEntity.js.map