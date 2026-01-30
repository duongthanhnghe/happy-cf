import { Schema, model, Types } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import type { PaginateModel } from "mongoose";
import type { ProductLiteDTO } from "@/server/types/dto/v1/product.dto";

export interface FlashSaleBanner {
  id: string;
  src: string;
}

export interface FlashSaleTheme {
  primaryColor?: string;
  backgroundColor?: string;
  textColor?: string;
}

export interface FlashSaleItem {
  productId: Types.ObjectId | ProductLiteDTO;
  variantSku: string | null;

  originalPrice: number;
  salePrice: number;

  quantity: number;
  sold: number;
}

export interface FlashSale {
  _id: Types.ObjectId;

  name: string;
  slug: string;
  description?: string;

  startDate: Date;
  endDate: Date;
  isActive: boolean;
  priority: number;

  banners: FlashSaleBanner[];
  theme: FlashSaleTheme;

  titleSEO: string;
  descriptionSEO: string;

  badgeImage: string;

  items: FlashSaleItem[];

  stackableWithVoucher: boolean;
  stackableWithPromotionGift: boolean;

  createdAt?: Date;
  updatedAt?: Date;
}

const FlashSaleBannerSchema = new Schema<FlashSaleBanner>(
  {
    id: { type: String, required: true },
    src: { type: String, required: true },
  },
  { _id: false }
);

const FlashSaleThemeSchema = new Schema<FlashSaleTheme>(
  {
    primaryColor: { type: String },
    backgroundColor: { type: String },
    textColor: { type: String },
  },
  { _id: false }
);

const FlashSaleItemSchema = new Schema<FlashSaleItem>(
  {
    productId: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    variantSku: { type: String },

    originalPrice: { type: Number, required: true },
    salePrice: { type: Number, required: true },

    quantity: { type: Number, required: true },
    sold: { type: Number, default: 0 },
  },
  { _id: false }
);

const FlashSaleSchema = new Schema<FlashSale>(
  {
    name: { type: String, required: true, trim: true },

    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[a-z0-9-]+$/, "Slug chỉ được chứa chữ thường, số và dấu gạch ngang"],
    },

    description: { type: String },

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    isActive: { type: Boolean, default: true },
    priority: { type: Number, default: 0 },

    banners: {
      type: [FlashSaleBannerSchema],
      default: [],
    },

    theme: {
      type: FlashSaleThemeSchema,
      default: undefined,
    },

    titleSEO: { type: String, trim: true },
    descriptionSEO: { type: String, trim: true, maxlength: 160 },

    badgeImage: { type: String },

    items: {
      type: [FlashSaleItemSchema],
      required: true,
      default: [],
    },

    stackableWithVoucher: { type: Boolean, default: false },
    stackableWithPromotionGift: { type: Boolean, default: true },
  },
  { timestamps: true }
);

FlashSaleSchema.plugin(mongoosePaginate);

FlashSaleSchema.index({ startDate: 1, endDate: 1, isActive: 1 });
FlashSaleSchema.index({ "items.productId": 1 });
FlashSaleSchema.index({ "items.variantSku": 1 });

export const FlashSaleEntity = model<
  FlashSale,
  PaginateModel<FlashSale>
>("FlashSale", FlashSaleSchema, "flash_sales");