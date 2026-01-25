import type {
  GetAvailablePromotionGiftsBody,
  AvailablePromotionGiftDTO,
} from "@/server/types/dto/v1/promotion-gift.dto";
import type { ApiResponse } from "@server/types/common/api-response";
import { apiError } from "@/server/types/common/api-response";
import { apiClient } from "../http/apiClient";
import { API_ENDPOINTS } from "../const/api.const";

export const promotionGiftAPI = {
  getAvailablePromotionGifts: async (
    payload: GetAvailablePromotionGiftsBody
  ): Promise<ApiResponse<AvailablePromotionGiftDTO[]>> => {
    try {
      return apiClient().post<ApiResponse<AvailablePromotionGiftDTO[]>>(
        API_ENDPOINTS.PROMOTION_GIFT.LIST,
        payload
      )
    } catch (err: any) {
      console.error("Error fetching promotion gift:", err)
      return apiError<AvailablePromotionGiftDTO[]>(err)
    }
  },
};
