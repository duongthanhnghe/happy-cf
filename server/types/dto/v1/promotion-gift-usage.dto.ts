import type { PaginationDTO } from "../../common/pagination.dto";
import type { PromotionGiftDTO } from "./promotion-gift.dto";
import type { User } from "./user.dto";
import type { OrderDTO } from "./order.dto";

export interface PromotionGiftUsageDTO {
  id: string;

  promotionGiftId: string | PromotionGiftDTO;
  orderId: string | OrderDTO;
  userId?: string | User | null;

  reverted: boolean;
  revertedAt?: string | null;

  meta?: {
    ip?: string;
    userAgent?: string;
  };

  usedAt: string;

  createdAt: string;
  updatedAt: string;
}

export type PromotionGiftUsagePaginationDTO =
  PaginationDTO<PromotionGiftUsageDTO>;
