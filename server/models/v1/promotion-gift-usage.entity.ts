import { Schema, model, Types } from "mongoose";

export interface PromotionGiftUsage {
  _id: Types.ObjectId;

  promotionGiftId: Types.ObjectId;
  orderId: Types.ObjectId;
  userId?: Types.ObjectId | null;

  usedAt: Date;

  reverted: boolean;
  revertedAt: Date | null;

  meta?: {
    ip?: string;
    userAgent?: string;
  };
}

const PromotionGiftUsageSchema = new Schema<PromotionGiftUsage>(
  {
    promotionGiftId: {
      type: Schema.Types.ObjectId,
      ref: "PromotionGift",
      required: true,
    },

    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    usedAt: { type: Date, default: Date.now },

    reverted: { type: Boolean, default: false },
    revertedAt: { type: Date },

    meta: {
      ip: String,
      userAgent: String,
    },
  },
  { timestamps: true }
);

PromotionGiftUsageSchema.index({ promotionGiftId: 1, orderId: 1 });
PromotionGiftUsageSchema.index({ orderId: 1 });

export const PromotionGiftUsageEntity = model(
  "PromotionGiftUsage",
  PromotionGiftUsageSchema,
  "promotion_gift_usages"
);
