import { API_ENDPOINTS } from "@/services/const/api.const";
import { apiClient } from "../http/apiClient";
import type { VariantGroupDTO } from "@/server/types/dto/v1/product.dto";
import type { ApiResponse } from "@/server/types/common/api-response";
import { apiError } from "@/server/types/common/api-response"

export const variantGroupAPI = {
  getAll: async (): Promise<ApiResponse<VariantGroupDTO[]>> => {
    try {
      return await apiClient().get<ApiResponse<VariantGroupDTO[]>>(
        API_ENDPOINTS.VARIANT_GROUPS.LIST_ALL
      );
    } catch (err: any) {
      console.error("Error fetching active variant groups:", err);
      return apiError<VariantGroupDTO[]>(err)
    }
  },
};
