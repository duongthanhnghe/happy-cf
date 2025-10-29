import type { VoucherUsageDTO } from "../../types/dto/v1/voucher-usage.dto";
import type { VoucherUsage } from "../../models/v1/VoucherEntity";
import type { ApplyVoucherProduct } from "@/server/types/dto/v1/voucher.dto";

export function toVoucherUsageDTO(entity: VoucherUsage): VoucherUsageDTO {
  return {
    id: entity._id?.toString() ?? "",
    voucherId: entity.voucherId?.toString() ?? "",
    userId: entity.userId
      ? (entity.userId as any)._id
        ? (entity.userId as any)._id.toString()
        : entity.userId.toString()           
      : null,
    orderId: entity.orderId?.toString() ?? "",

    code: entity.code,
    type: entity.type,
    discount: entity.discount ?? 0,

    applicableProducts: entity.applicableProducts?.map((p: any) => ({
      productId: p.productId?.toString() ?? "",
      name: p.name ?? "",
      categoryId: p.categoryId?.toString() ?? undefined,
      price: p.price ?? 0,
      quantity: p.quantity ?? 0,
    })) ?? [],

    expiresAt: entity.expiresAt ? entity.expiresAt.toISOString() : null,
    stackable: entity.stackable ?? false,

    usedAt: entity.usedAt?.toISOString() ?? "",
    reverted: entity.reverted ?? false,
    revertedAt: entity.revertedAt ? entity.revertedAt.toISOString() : null,

    meta: {
      ip: entity.meta?.ip ?? "",
      userAgent: entity.meta?.userAgent ?? "",
    },

    createdAt: entity.createdAt?.toISOString() ?? "",
    updatedAt: entity.updatedAt?.toISOString() ?? "",
  };
}

export const toVoucherUsageListDTO = (entities: VoucherUsage[]): VoucherUsageDTO[] => {
  return entities.map(toVoucherUsageDTO);
};
