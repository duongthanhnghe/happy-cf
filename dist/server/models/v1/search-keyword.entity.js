import { Schema, model } from "mongoose";
const SearchKeywordSchema = new Schema({
    keyword: { type: String, required: true, trim: true, index: true },
    totalCount: { type: Number, default: 0 },
    lastSearchTime: { type: Date, default: Date.now },
}, {
    timestamps: { createdAt: true, updatedAt: false }
});
export const SearchKeywordModel = model("SearchKeyword", SearchKeywordSchema, "search_keywords");
//# sourceMappingURL=search-keyword.entity.js.map