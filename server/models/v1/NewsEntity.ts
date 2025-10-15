import mongoose, { Schema, Types, model } from "mongoose";
import { generateSlug } from "../../utils/generateSlug";
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
  //SEO
  titleSEO: string;
  descriptionSEO: string;
  slug: string;
  canonicalUrl?: string;
  keywords?: string[];
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
    titleSEO: {
      type: String,
      trim: true
    },
    descriptionSEO: {
      type: String,
      maxlength: 160,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang']
    },
    keywords: {
      type: [String],
      default: []
    }
  },
  { timestamps: true },
);

PostNewsSchema.index({ slug: 1 }, { unique: true });
PostNewsSchema.index({ isActive: 1, createdAt: -1 });
PostNewsSchema.index({ categoryId: 1, isActive: 1 });

PostNewsSchema.pre('save', function(next) {
  if (!this.slug && this.titleSEO) {
    this.slug = generateSlug(this.titleSEO);
  }
  
  next();
});

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
  //SEO
  titleSEO: string;
  descriptionSEO?: string;
  slug: string;
  keywords?: string[];
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
    titleSEO: {
      type: String,
      trim: true,
      required: true,
    },
    descriptionSEO: {
      type: String,
      maxlength: 160,
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang']
    },
    keywords: {
      type: [String],
      default: []
    }
  },
  { timestamps: true }
);

CategoryNewsSchema.index({ slug: 1 }, { unique: true });
CategoryNewsSchema.index({ isActive: 1, order: 1 });

CategoryNewsSchema.pre('save', function(next) {
  if (!this.slug && this.titleSEO) {
    this.slug = generateSlug(this.titleSEO);
  }
  
  next();
});

export const CategoryNewsModel = model<CategoryNewsDocument>("CategoryNews", CategoryNewsSchema, 'post_categories');
