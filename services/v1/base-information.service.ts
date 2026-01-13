import { apiClient } from "@/services/http/apiClient";
import { API_ENDPOINTS } from "../const/api.const";
import type { ApiResponse } from "@/server/types/common/api-response";
import { apiError } from "@/server/types/common/api-response"
import type { BaseInformationDTO } from "@/server/types/dto/v1/base-information.dto";

export const baseInformationAPI = {
  getBaseInformation: async (): Promise<ApiResponse<BaseInformationDTO>> => {
    try {
      return await apiClient().get<ApiResponse<BaseInformationDTO>>(
        API_ENDPOINTS.BASE_INFORMATION.GET
      );
    } catch (err: any) {
      console.error("Error fetching base information:", err);
      return apiError<BaseInformationDTO>(err)
    }
  },
};