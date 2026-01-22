import type { PaginationDTO } from "../../common/pagination.dto";

export interface PromotionGiftDTO {
  id: string;

  name: string;
  description?: string;

  isActive: boolean;

  minOrderValue: number;

  requiredProducts?: string[];
  requiredCategories?: string[];

  startDate: string;
  endDate: string;

  gifts: {
    productId: string;
    quantity: number;
    productName?: string;
    image?: string;
  }[];

  usageLimit: number;
  usedCount: number;

  stackable: boolean;

  createdAt: string;
  updatedAt: string;
}

export type CreatePromotionGiftBody = Omit<
  PromotionGiftDTO,
  "id" | "usedCount" | "createdAt" | "updatedAt"
>;

export type UpdatePromotionGiftBody = Partial<CreatePromotionGiftBody>;

export type PromotionGiftPaginationDTO = PaginationDTO<PromotionGiftDTO>
