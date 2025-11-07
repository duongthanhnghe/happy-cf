import { Schema, model } from "mongoose";
const ListImageSchema = new Schema({
    id: { type: String, required: true },
    src: { type: String, required: true },
}, { _id: false });
const AboutSchema = new Schema({
    title: { type: String, required: true },
    summaryContent: { type: String },
    description: { type: String },
    image: { type: String, required: true },
    listImage: { type: [ListImageSchema], default: [] },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
export const AboutEntity = model("About", AboutSchema, "about");
//# sourceMappingURL=about.entity.js.map