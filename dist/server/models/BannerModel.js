import { Schema, model } from "mongoose";
const BannerSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
export const BannerModel = model("Banner", BannerSchema, "banners");
//# sourceMappingURL=BannerModel.js.map