import type { VoucherDTO } from "../../types/dto/v1/voucher.dto";
import type { Voucher } from "../../models/v1/voucher.entity";

export function toVoucherDTO(entity: Voucher): VoucherDTO {
  return {
    id: entity._id.toString(),
    code: entity.code,
    name: entity.name,
    description: entity.description,
    image: entity.image,

    type: entity.type,
    value: entity.value,
    maxDiscount: entity.maxDiscount,
    minOrderValue: entity.minOrderValue ?? 0,

    maxShippingDiscount: entity.maxShippingDiscount ?? undefined,

    usageLimit: entity.usageLimit ?? 0,
    usedCount: entity.usedCount ?? 0,
    limitPerUser: entity.limitPerUser ?? 0,

    startDate: entity.startDate?.toISOString(),
    endDate: entity.endDate?.toISOString(),

    applicableProducts: entity.applicableProducts?.map((p) => p.toString()) ?? [],
    applicableCategories: entity.applicableCategories?.map((c) => c.toString()) ?? [],

    stackable: entity.stackable ?? false,
    isActive: entity.isActive ?? true,

    usedBy: entity.usedBy?.map(toUsedBy) ?? [],

    createdAt: entity.createdAt?.toISOString() || "",
  };
}

export function toUsedBy(entity: any): any {
  return {
    userId: entity.userId,
    count: entity.count,
  };
}

export const toVoucherListDTO = (vouchers: Voucher[]): VoucherDTO[] => {
  return vouchers.map(toVoucherDTO);
};
