import mongoose, { Schema } from "mongoose";
const PostNewsSchema = new Schema({
    id: { type: String, required: true },
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    summaryContent: { type: String },
    isActive: { type: Boolean, default: true },
    categoryId: { type: String, required: true },
    time: { type: Date, default: Date.now },
    views: { type: Number },
    author: { type: String },
}, { timestamps: true });
export default mongoose.model("PostNewsModel", PostNewsSchema);
//# sourceMappingURL=News.js.map