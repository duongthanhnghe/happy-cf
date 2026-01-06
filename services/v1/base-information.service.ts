import { apiClient } from "@/services/http/apiClient";
import { API_ENDPOINTS } from "../const/api.const";
import type { ApiResponse } from "@/server/types/common/api-response";

export const baseInformationAPI = {
  getBaseInformation: async (): Promise<ApiResponse<any>> => {
    try {
      return await apiClient().get<ApiResponse<any>>(
        API_ENDPOINTS.BASE_INFORMATION.GET
      );
    } catch (err: any) {
      console.error("Error fetching base information:", err);
      return {
        code: 1,
        message: err.message ?? "Failed to fetch base information",
        data: [],
      };
    }
  },
};