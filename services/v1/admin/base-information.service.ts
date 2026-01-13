import { apiAdmin } from "@/services/http/apiAdmin";
import type { ApiResponse } from "@/server/types/common/api-response";
import { API_ENDPOINTS_ADMIN } from "@/services/const/api-endpoints-admin";
import { apiError } from '@/server/types/common/api-response'
import type { BaseInformationDTO } from "@/server/types/dto/v1/base-information.dto";

export const baseInformationAPI = {
  getBaseInformation: async (): Promise<ApiResponse<BaseInformationDTO>> => {
    try {
      return await apiAdmin().get<ApiResponse<any>>(
        API_ENDPOINTS_ADMIN.BASE_INFORMATION.GET
      );
    } catch (err: any) {
      console.error("Error fetching base information:", err);
      return apiError<BaseInformationDTO>(err)
    }
  },

  updateBaseInformation: async (newData: any): Promise<ApiResponse<any>> => {
    try {
      return await apiAdmin().put<ApiResponse<any>>(
        API_ENDPOINTS_ADMIN.BASE_INFORMATION.UPDATE,
        newData
      );
    } catch (err: any) {
      console.error("Error updating base information:", err);
      return apiError<BaseInformationDTO>(err)
    }
  },
};
