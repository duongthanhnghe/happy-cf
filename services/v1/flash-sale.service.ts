import { apiClient } from "@/services/http/apiClient";
import { API_ENDPOINTS } from "../const/api.const";
import type {
  FlashSaleDTO,
} from "@/server/types/dto/v1/flash-sale.dto";
import type { ApiResponse } from "@/server/types/common/api-response";
import { apiError } from "@/server/types/common/api-response";

export const flashSalesAPI = {

  getTopPriority: async (): Promise<ApiResponse<FlashSaleDTO>> => {
    try {
      return await apiClient().get<ApiResponse<FlashSaleDTO>>(
        API_ENDPOINTS.FLASH_SALES.LIST_PRIORITY
      );
    } catch (err: any) {
      return apiError<FlashSaleDTO>(err);
    }
  },

  getDetail: async (id: string): Promise<ApiResponse<FlashSaleDTO>> => {
    try {
      return await apiClient().get<ApiResponse<FlashSaleDTO>>(
        API_ENDPOINTS.FLASH_SALES.GET_BY_ID(id)
      );
    } catch (err: any) {
      return apiError<FlashSaleDTO>(err);
    }
  },

};