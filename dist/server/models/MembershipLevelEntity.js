import { Schema, model } from "mongoose";
const MembershipLevelSchema = new Schema({
    name: { type: String, required: true, unique: true },
    minPoint: { type: Number, required: true },
    icon: { type: String },
    image: { type: String },
}, { timestamps: false });
export const MembershipLevelModel = model("MembershipLevel", MembershipLevelSchema, "membership_levels");
//# sourceMappingURL=MembershipLevelEntity.js.map