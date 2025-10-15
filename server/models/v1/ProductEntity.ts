import { Schema, model, models, Types, Document } from "mongoose";

// ------------------- INTERFACES -------------------

export interface Variant {
  id: string;
  name: string;
  priceModifier: number | null;
  inStock: boolean;
}

export interface Option {
  id: string;
  name: string;
  required: boolean;
  variants: Variant[];
}

export interface ListImage {
  id: string;
  src: string;
}

export interface Product {
  _id: Types.ObjectId;
  productName: string;
  description?: string;
  summaryContent?: string;
  price: number;
  priceDiscounts: number;
  amount: number;
  amountOrder: number;
  image: string;
  listImage: ListImage[];
  options: Option[];
  categoryId: Types.ObjectId | null;
  weight: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  //SEO
  titleSEO: string;
  descriptionSEO: string;
  slug: string;
  canonicalUrl?: string;
  keywords?: string[];
}

export interface CategoryProduct {
  _id: Types.ObjectId;
  categoryName: string;
  description?: string;
  image: string;
  order: number;
  isActive: boolean;
  parentId?: Types.ObjectId | null;
  //SEO
  titleSEO: string;
  descriptionSEO: string;
  slug: string;
  canonicalUrl?: string;
  keywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const VariantSchema = new Schema<Variant>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    priceModifier: { type: Number, default: null },
    inStock: { type: Boolean, default: true },
  },
  { _id: false }
);

const OptionSchema = new Schema<Option>(
  {
    id: { type: String, required: true },
    name: { type: String, required: true },
    required: { type: Boolean, default: false },
    variants: { type: [VariantSchema], default: [] },
  },
  { _id: false }
);

const ListImageSchema = new Schema<ListImage>(
  {
    id: { type: String, required: true },
    src: { type: String, required: true },
  },
  { _id: false }
);

const ProductSchema = new Schema<Product>(
  {
    productName: { type: String, required: true, trim: true },
    description: { type: String },
    summaryContent: { type: String },
    price: { type: Number, default: null },
    priceDiscounts: { type: Number, default: null },
    amount: { type: Number, default: null },
    amountOrder: { type: Number, default: 0 },
    image: { type: String, required: true },
    listImage: { type: [ListImageSchema], default: [] },
    options: { type: [OptionSchema], default: [] },
    categoryId: { type: Schema.Types.ObjectId, ref: "CategoryProduct", required: true },
    weight: { type: Number, default: 0 },
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

const CategoryProductSchema = new Schema<CategoryProduct>(
  {
    categoryName: { type: String, required: true, trim: true },
    description: { type: String },
    image: { type: String, required: true },
    order: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
    parentId: { type: Schema.Types.ObjectId, ref: "CategoryProduct", default: null },
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

export const ProductEntity = model("Product", ProductSchema, "products");

export const CategoryProductEntity = model("CategoryProduct", CategoryProductSchema, "product_categories");
