import { Schema, model, models, Types, Document } from "mongoose";

export interface ProductSelectedVariant {
  variantId: string;
  variantName: string;
  priceModifier: number;
  inStock: boolean;
  stock: number;
  sku: string;
  image: string;
}

export interface ProductVariantGroup {
  groupId: string;
  groupName: string;
  required: boolean;
  selectedVariants: ProductSelectedVariant[];
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
  variantGroups: ProductVariantGroup[];
  categoryId: Types.ObjectId;
  category?: CategoryProduct | null;
  weight: number;
  sku: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  vouchers: {
  image: string;
} | null;
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
  banner?: string;
  parentId?: Types.ObjectId | null;
  parent?: CategoryProduct | null;
  //SEO
  titleSEO: string;
  descriptionSEO: string;
  slug: string;
  canonicalUrl?: string;
  keywords?: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ListImageSchema = new Schema<ListImage>(
  {
    id: { type: String, required: true },
    src: { type: String, required: true },
  },
  { _id: false }
);

const ProductSelectedVariantSchema = new Schema<ProductSelectedVariant>(
  {
    variantId: { type: String, required: true },
    variantName: { type: String, required: true },
    priceModifier: { type: Number, default: 0 },
    inStock: { type: Boolean, default: true },
    stock: { type: Number, default: 0 },
    sku: { type: String, required: true },
    image: { type: String },
  },
  { _id: false }
);

const ProductVariantGroupSchema = new Schema<ProductVariantGroup>(
  {
    groupId: { type: String, required: true },
    groupName: { type: String, required: true },
    required: { type: Boolean, default: false },
    selectedVariants: { type: [ProductSelectedVariantSchema], default: [] },
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
    variantGroups: { type: [ProductVariantGroupSchema], default: [] },
    categoryId: { type: Schema.Types.ObjectId, ref: "CategoryProduct", required: true },
    weight: { type: Number, default: 0 },
    sku: { type: String, required: true, unique: true },
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
    banner: { type: String },
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

ProductSchema.virtual("category", {
  ref: "CategoryProduct",
  localField: "categoryId",
  foreignField: "_id",
  justOne: true
});

ProductSchema.set("toObject", { virtuals: true });
ProductSchema.set("toJSON", { virtuals: true });

export const ProductEntity = model("Product", ProductSchema, "products");

export const CategoryProductEntity = model("CategoryProduct", CategoryProductSchema, "product_categories");
