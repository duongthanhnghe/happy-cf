import { apiClient } from "@/services/http/apiClient";
import { apiAdmin } from "@/services/http/apiAdmin";
import { API_ENDPOINTS_SHARED } from "@/services/const/api.endpoints-shared";
import type { ApiResponse } from "@/server/types/common/api-response";

export const baseInformationAPI = {
  getBaseInformation: async (): Promise<ApiResponse<any>> => {
    try {
      return await apiClient().get<ApiResponse<any>>(
        API_ENDPOINTS_SHARED.BASE_INFORMATION.GET
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

  updateBaseInformation: async (newData: any): Promise<ApiResponse<any>> => {
    try {
      return await apiAdmin().put<ApiResponse<any>>(
        API_ENDPOINTS_SHARED.BASE_INFORMATION.UPDATE,
        newData
      );
    } catch (err: any) {
      console.error("Error updating base information:", err);
      return {
        code: 1,
        message: err.message ?? "Failed to update base information",
        data: [],
      };
    }
  },
};

// import { API_ENDPOINTS_SHARED } from '@/services/const/api.endpoints-shared'
// import { fetchWithAuthAdmin } from '@/services/helpers/fetchWithAuthAdmin';

// export const baseInformationAPI = {
//   getBaseInformation: async (): Promise<any> => {
//     try {
//       const res = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS_SHARED.BASE_INFORMATION.GET}`, {
//         method: "GET",
//         headers: { "Content-Type": "application/json" },
//       });

//       const result = await res.json();
//       return result;
//     } catch (err) {
//       console.error("Error:", err);
//       return {
//         code: 1,
//         message: "Failed to fetch",
//         data: [],
//       };
//     }
//   },

//   updateBaseInformation: async (newData: any): Promise<any> => {
//     try {
//       const res = await fetchWithAuthAdmin(`${apiConfig.baseApiURL}${API_ENDPOINTS_SHARED.BASE_INFORMATION.UPDATE}`, {
//         method: "PUT",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newData),
//       });

//       const result = await res.json();
//       return result;
//     } catch (err) {
//       console.error("Error:", err);
//       return {
//         code: 1,
//         message: "Failed to fetch",
//         data: [],
//       };
//     }
//   },
// }
