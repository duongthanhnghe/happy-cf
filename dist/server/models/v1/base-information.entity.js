import { Schema, model } from "mongoose";
const SocialLinkSchema = new Schema({
    name: { type: String, required: true },
    icon: { type: String, required: true },
    src: { type: String, required: true },
}, { _id: false });
const BaseInformationSchema = new Schema({
    name: { type: String, required: true },
    logoUrl: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    address: { type: String, required: true },
    openingHours: { type: String, required: true },
    socialLinks: { type: [SocialLinkSchema], default: [] },
    description: { type: String },
    provinceCode: { type: Number },
    districtCode: { type: Number },
    wardCode: { type: Number },
}, { timestamps: true });
export const BaseInformationEntity = model("BaseInformation", BaseInformationSchema, "base_information");
//# sourceMappingURL=base-information.entity.js.map