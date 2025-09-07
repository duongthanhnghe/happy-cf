import { Schema, model, Types } from "mongoose";

export interface SearchKeyword {
  _id: Types.ObjectId
  keyword: string
  totalCount: number
  lastSearchTime: Date
  createdAt: Date
}

const SearchKeywordSchema = new Schema<SearchKeyword>(
  {
    keyword: { type: String, required: true, trim: true, index: true },
    totalCount: { type: Number, default: 0 },
    lastSearchTime: { type: Date, default: Date.now },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

export const SearchKeywordModel = model("SearchKeyword", SearchKeywordSchema, "search_keywords");
