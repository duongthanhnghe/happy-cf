import type { PromotionGiftDTO } from "../../types/dto/v1/promotion-gift.dto";
import type { PromotionGift } from "../../models/v1/promotion-gift.entity";
import { toProductDTO } from "./product.mapper";
import { Types } from "mongoose";

function mapIdOrObject<T extends Record<string, any>>(
  value?: Array<
    Types.ObjectId |
    string |
    (T & { _id?: any; toObject?: () => any })
  >
): (string | ({ id: string } & Partial<T>))[] | undefined {
  if (!value) return undefined;

  return value.map(v => {
    if (typeof v === 'string') {
      return v;
    }

    if (v instanceof Types.ObjectId) {
      return v.toString();
    }

    if (typeof v === 'object') {
      const raw =
        typeof (v as any).toObject === 'function'
          ? (v as any).toObject()
          : v;

      if (raw._id) {
        const { _id, ...rest } = raw;
        return {
          id: _id.toString(),
          ...rest,
        };
      }
    }

    return String(v);
  });
}

export function toPromotionGiftDTO(
  entity: PromotionGift
): PromotionGiftDTO {
  return {
    id: entity._id.toString(),

    name: entity.name,
    description: entity.description,

    isActive: entity.isActive,

    minOrderValue: entity.minOrderValue,

    requiredProducts: mapIdOrObject<{
      productName?: string
    }>(entity.requiredProducts),

    requiredCategories: mapIdOrObject<{
      categoryName?: string
    }>(entity.requiredCategories),

    startDate: entity.startDate.toISOString(),
    endDate: entity.endDate.toISOString(),

    gifts: entity.gifts.map(gift => {
      const product: any = gift.productId as any

      return {
        productId: product?._id
          ? product._id.toString()
          : product.toString(),

        productName: product?.productName,
        image: product?.image,

        quantity: gift.quantity,
      }
    }),

    usageLimit: entity.usageLimit,
    usedCount: entity.usedCount,

    stackable: entity.stackable,

    createdAt: entity.createdAt?.toISOString() || '',
    updatedAt: entity.updatedAt?.toISOString() || '',
  };
}

export const toPromotionGiftListDTO = (
  entities: PromotionGift[]
): PromotionGiftDTO[] => {
  return entities.map(toPromotionGiftDTO);
};

export function toAvailablePromotionGiftDTO(
  entity: PromotionGift
): PromotionGiftDTO {
  return {
    id: entity._id.toString(),

    name: entity.name,
    description: entity.description,

    isActive: entity.isActive,
    minOrderValue: entity.minOrderValue,

    requiredProducts: mapIdOrObject<{
      productName?: string
    }>(entity.requiredProducts),

    requiredCategories: mapIdOrObject<{
      categoryName?: string
    }>(entity.requiredCategories),
    // requiredProducts: entity.requiredProducts?.map(id => id.toString()),
    // requiredCategories: entity.requiredCategories?.map(id => id.toString()),

    startDate: entity.startDate.toISOString(),
    endDate: entity.endDate.toISOString(),

    gifts: entity.gifts.map(gift => {
      const productEntity = gift.productId as any

      return {
        productId: productEntity._id.toString(),
        quantity: gift.quantity,
        product: toProductDTO(productEntity),
      }
    }),

    usageLimit: entity.usageLimit,
    usedCount: entity.usedCount,
    stackable: entity.stackable,

    createdAt: entity.createdAt?.toISOString() || '',
    updatedAt: entity.updatedAt?.toISOString() || '',
  }
}