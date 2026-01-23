import { API_ENDPOINTS_ADMIN } from "@/services/const/api-endpoints-admin";
import { apiAdmin } from "@/services/http/apiAdmin";
import type {
  PromotionGiftDTO,
  CreatePromotionGiftBody,
  UpdatePromotionGiftBody,
  PromotionGiftPaginationDTO,
} from "@/server/types/dto/v1/promotion-gift.dto";
import type { ApiResponse } from "@server/types/common/api-response";
import { apiError } from "@/server/types/common/api-response";
import { paginationError } from "@/server/types/common/pagination.dto";

export const promotionGiftAPI = {
  getAll: async (
    page = 1,
    limit = 10,
    filters?: {
      name?: string;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<PromotionGiftPaginationDTO> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters?.name) params.append("name", filters.name);
      if (filters?.fromDate) params.append("fromDate", filters.fromDate);
      if (filters?.toDate) params.append("toDate", filters.toDate);

      const url = `${API_ENDPOINTS_ADMIN.PROMOTION_GIFT.LIST}?${params.toString()}`;
      return await apiAdmin().get<PromotionGiftPaginationDTO>(url);
    } catch (err: any) {
      console.error("Error fetching promotion gift:", err);
      return paginationError<PromotionGiftDTO>(page, limit, err)
    }
  },

  getDetail: async (id: string): Promise<ApiResponse<PromotionGiftDTO>> => {
    try {
      return await apiAdmin().get<ApiResponse<PromotionGiftDTO>>(
        API_ENDPOINTS_ADMIN.PROMOTION_GIFT.GET_BY_ID(id)
      );
    } catch (err: any) {
      console.error(`Error getting Promotion Gift ${id}:`, err);
      return apiError<PromotionGiftDTO>(err);
    }
  },

  create: async (
    bodyData: CreatePromotionGiftBody
  ): Promise<ApiResponse<PromotionGiftDTO>> => {
    try {
      return await apiAdmin().post<ApiResponse<PromotionGiftDTO>>(
        API_ENDPOINTS_ADMIN.PROMOTION_GIFT.CREATE,
        bodyData
      );
    } catch (err: any) {
      console.error("Error creating Promotion Gift:", err);
      return apiError<PromotionGiftDTO>(err);
    }
  },

  update: async (
    id: string,
    bodyData: UpdatePromotionGiftBody
  ): Promise<ApiResponse<PromotionGiftDTO>> => {
    try {
      return await apiAdmin().put<ApiResponse<PromotionGiftDTO>>(
        API_ENDPOINTS_ADMIN.PROMOTION_GIFT.UPDATE(id),
        bodyData
      );
    } catch (err: any) {
      console.error(`Error updating Promotion Gift ${id}:`, err);
      return apiError<PromotionGiftDTO>(err);
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      return await apiAdmin().delete<ApiResponse<null>>(
        API_ENDPOINTS_ADMIN.PROMOTION_GIFT.DELETE(id)
      );
    } catch (err: any) {
      console.error(`Error deleting Promotion Gift ${id}:`, err);
      return apiError<null>(err);
    }
  },

  toggleActive: async (id: string): Promise<ApiResponse<PromotionGiftDTO>> => {
    try {
      return await apiAdmin().patch<ApiResponse<PromotionGiftDTO>>(API_ENDPOINTS_ADMIN.PROMOTION_GIFT.TOGGLE_ACTIVE(id));
    } catch (err: any) {
      console.error(`Error toggling active status for Promotion Gift ID ${id}:`, err);
      return apiError<PromotionGiftDTO>(err)
    }
  },
};
