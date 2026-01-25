import type { PromotionGiftDTO } from "../../types/dto/v1/promotion-gift.dto";
import type { PromotionGift } from "../../models/v1/promotion-gift.entity";
import { toProductDTO } from "./product.mapper";

export function toPromotionGiftDTO(
  entity: PromotionGift
): PromotionGiftDTO {
  return {
    id: entity._id.toString(),

    name: entity.name,
    description: entity.description,

    isActive: entity.isActive,

    minOrderValue: entity.minOrderValue,

    requiredProducts: entity.requiredProducts?.map(id => id.toString()),
    requiredCategories: entity.requiredCategories?.map(id => id.toString()),

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

    requiredProducts: entity.requiredProducts?.map(id => id.toString()),
    requiredCategories: entity.requiredCategories?.map(id => id.toString()),

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