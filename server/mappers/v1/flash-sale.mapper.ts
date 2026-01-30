import type { FlashSaleDTO } from "../../types/dto/v1/flash-sale.dto";
import type { FlashSale } from "../../models/v1/flash-sale.entity";
import { Types } from "mongoose";

const isObjectId = (val: any): val is Types.ObjectId => {
  return val instanceof Types.ObjectId;
};

export function toFlashSaleDTO(entity: FlashSale): FlashSaleDTO {
  return {
    id: entity._id.toString(),

    name: entity.name,
    slug: entity.slug,
    description: entity.description,

    startDate: entity.startDate.toISOString(),
    endDate: entity.endDate.toISOString(),

    isActive: entity.isActive,
    priority: entity.priority,

    banners: entity.banners ?? [],

    theme: entity.theme ?? undefined,

    titleSEO: entity.titleSEO,
    descriptionSEO: entity.descriptionSEO,

    badgeImage: entity.badgeImage,

    items: entity.items.map((item) => ({
      productId: isObjectId(item.productId)
        ? item.productId.toString()
        : {
            id: item.productId.id.toString(),
            productName: item.productId.productName,
            image: item.productId.image ?? [],
          },
      variantSku: item.variantSku,

      originalPrice: item.originalPrice,
      salePrice: item.salePrice,

      quantity: item.quantity,
      sold: item.sold,
    })),

    stackableWithVoucher: entity.stackableWithVoucher,
    stackableWithPromotionGift: entity.stackableWithPromotionGift,

    createdAt: entity.createdAt?.toISOString() || "",
  };
}

export const toFlashSaleListDTO = (entities: FlashSale[]): FlashSaleDTO[] =>
  entities.map(toFlashSaleDTO);