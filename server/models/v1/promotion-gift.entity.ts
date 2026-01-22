import { Schema, model, Types, type PaginateModel } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

export interface PromotionGift {
  _id: Types.ObjectId;

  name: string;                 // Tên CTKM
  description?: string;

  isActive: boolean;

  minOrderValue: number;        // Đơn tối thiểu
  requiredProducts?: Types.ObjectId[];   // Có các SP này trong cart
  requiredCategories?: Types.ObjectId[]; // Hoặc thuộc category này

  startDate: Date;
  endDate: Date;

  gifts: {
    productId: Types.ObjectId;  // Product được làm gift
    quantity: number;           // Số lượng tặng
  }[];

  usageLimit: number;           // Tổng lượt dùng (0 = không giới hạn)
  usedCount: number;

  stackable: boolean;           // Có cộng dồn với promotion khác không

  createdAt?: Date;
  updatedAt?: Date;
}

const PromotionGiftSchema = new Schema<PromotionGift>(
  {
    name: { type: String, required: true },
    description: { type: String },

    isActive: { type: Boolean, default: true },

    minOrderValue: { type: Number, default: 0 },

    requiredProducts: [
      { type: Schema.Types.ObjectId, ref: "Product" }
    ],

    requiredCategories: [
      { type: Schema.Types.ObjectId, ref: "CategoryProduct" }
    ],

    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },

    gifts: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],

    usageLimit: { type: Number, default: 0 },
    usedCount: { type: Number, default: 0 },

    stackable: { type: Boolean, default: false },
  },
  { timestamps: true }
);

PromotionGiftSchema.plugin(mongoosePaginate)
PromotionGiftSchema.index({ name: 'text' })
PromotionGiftSchema.index({ startDate: 1, endDate: 1 })

export const PromotionGiftEntity = model<PromotionGift, PaginateModel<PromotionGift>>("PromotionGift", PromotionGiftSchema, "promotion_gifts");
