import { Types } from "mongoose";
import type { PromotionGiftUsage } from "../../models/v1/promotion-gift-usage.entity";

interface CreatePromotionGiftUsageParams {
  promotionGiftId: Types.ObjectId | string;
  orderId: Types.ObjectId | string;
  userId?: Types.ObjectId | string | null;
  ip?: string;
  userAgent?: string;
}

export const toCreatePromotionGiftUsageEntity = (
  params: CreatePromotionGiftUsageParams
): Omit<PromotionGiftUsage, "_id"> => {
  return {
    promotionGiftId: new Types.ObjectId(params.promotionGiftId),
    orderId: new Types.ObjectId(params.orderId),
    userId: params.userId
      ? new Types.ObjectId(params.userId)
      : null,

    usedAt: new Date(),

    reverted: false,
    revertedAt: null,

    meta: {
      ip: params.ip,
      userAgent: params.userAgent,
    },
  };
};
