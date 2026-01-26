import type { PaginationDTO } from "../../common/pagination.dto";
import type { ProductDTO } from "./product.dto";

export type IdOrObject<T> = string | T;

export interface PromotionGiftConditionProductDTO {
  id: string
  productName?: string
}

export interface PromotionGiftConditionCategoryDTO {
  id: string
  categoryName?: string
}
export interface PromotionGiftDTO {
  id: string;

  name: string;
  description?: string;

  isActive: boolean;

  minOrderValue: number;

  requiredProducts?: IdOrObject<PromotionGiftConditionProductDTO>[];
  requiredCategories?: IdOrObject<PromotionGiftConditionCategoryDTO>[];

  startDate: string;
  endDate: string;

  gifts: PromotionGiftItemDTO[];

  usageLimit: number;
  usedCount: number;

  stackable: boolean;

  createdAt: string;
  updatedAt: string;
}

export interface AvailablePromotionGiftDTO extends PromotionGiftDTO {
  locked: boolean
  message: string
  missingAmount: number
}

export type CreatePromotionGiftBody = Omit<
  PromotionGiftDTO,
  "id" | "usedCount" | "createdAt" | "updatedAt"
>;

export type UpdatePromotionGiftBody = Partial<CreatePromotionGiftBody>;

export type PromotionGiftPaginationDTO = PaginationDTO<PromotionGiftDTO>

export interface PromotionGiftItemDTO {
  productId: string
  quantity: number
  productName?: string;
  image?: string;
  product?: ProductDTO
}

export interface GetAvailablePromotionGiftsBody {
  productIds: string[]
  categoryIds: string[]
  orderTotal: number
}