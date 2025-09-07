import { Schema, Types, model } from "mongoose";
const PostNewsSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    summaryContent: { type: String },
    isActive: { type: Boolean, default: true },
    categoryId: { type: Types.ObjectId, ref: "CategoryNews", required: true },
    views: { type: Number, default: 0 },
    author: { type: String },
}, { timestamps: true });
export const PostNewsModel = model("Post", PostNewsSchema, "posts");
const CategoryNewsSchema = new Schema({
    categoryName: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    summaryContent: { type: String },
}, { timestamps: true });
export const CategoryNewsModel = model("CategoryNews", CategoryNewsSchema, 'post_categories');
//# sourceMappingURL=NewsModel.js.map