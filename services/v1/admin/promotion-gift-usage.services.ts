import { API_ENDPOINTS_ADMIN } from "@/services/const/api-endpoints-admin";
import { apiAdmin } from "@/services/http/apiAdmin";
import { paginationError } from "@/server/types/common/pagination.dto";
import type {
  PromotionGiftUsageDTO,
  PromotionGiftUsagePaginationDTO,
} from "@/server/types/dto/v1/promotion-gift-usage.dto";

export const promotionGiftUsageAPI = {
  getAll: async (
    page = 1,
    limit = 10,
    options?: {
      userId?: string;
      orderId?: string;
      promotionGiftId?: string;
      reverted?: boolean;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<PromotionGiftUsagePaginationDTO> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (options?.userId)
        params.append("userId", options.userId);

      if (options?.orderId)
        params.append("orderId", options.orderId);

      if (options?.promotionGiftId)
        params.append("promotionGiftId", options.promotionGiftId);

      if (options?.reverted !== undefined)
        params.append("reverted", String(options.reverted));

      if (options?.fromDate)
        params.append("fromDate", options.fromDate);

      if (options?.toDate)
        params.append("toDate", options.toDate);

      const url = `${API_ENDPOINTS_ADMIN.PROMOTION_GIFT_USAGE.LIST}?${params.toString()}`;

      return await apiAdmin().get<PromotionGiftUsagePaginationDTO>(url);
    } catch (err: any) {
      console.error("Error fetching promotion gift usage:", err);
      return paginationError<PromotionGiftUsageDTO>(page, limit, err);
    }
  },
};
