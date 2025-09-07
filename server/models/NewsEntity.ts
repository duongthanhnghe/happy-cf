import mongoose, { Schema, Types, model } from "mongoose";

export interface PostNews {
  title: string;
  description?: string;
  summaryContent?: string;
  image: string;
  isActive: boolean;
  categoryId: Types.ObjectId;
  views: number;
  author: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PostNewsDocument extends PostNews, Document {_id: Types.ObjectId}

const PostNewsSchema = new Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    image: { type: String, required: true },
    summaryContent: { type: String },
    isActive: { type: Boolean, default: true },
    categoryId: { type: Types.ObjectId, ref: "CategoryNews", required: true },
    views: { type: Number, default: 0 },
    author: { type: String },
  },
  { timestamps: true }
);

export const PostNewsModel = model<PostNewsDocument>("Post", PostNewsSchema, "posts");


/// CategoryNews
export interface CategoryNews {
  categoryName: string;
  description?: string;
  summaryContent?: string;
  image: string;
  order: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CategoryNewsDocument extends CategoryNews, Document {_id: Types.ObjectId}

const CategoryNewsSchema = new Schema(
  {
    categoryName: { type: String, required: true },
    description: { type: String },
    image: { type: String },
    summaryContent: { type: String },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const CategoryNewsModel = model<CategoryNewsDocument>("CategoryNews", CategoryNewsSchema, 'post_categories');
