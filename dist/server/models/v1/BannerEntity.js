import { Schema, model } from "mongoose";
const BannerSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
export const BannerEntity = model("Banner", BannerSchema, "banners");
//# sourceMappingURL=BannerEntity.js.map