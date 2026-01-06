import { API_ENDPOINTS } from "@/services/const/api.const";
import { apiClient } from "../http/apiClient";
import type { VariantGroupDTO } from "@/server/types/dto/v1/product.dto";
import type { ApiResponse } from "@/server/types/common/api-response";

export const variantGroupAPI = {
  getAll: async (): Promise<ApiResponse<VariantGroupDTO[]>> => {
    try {
      return await apiClient().get<ApiResponse<VariantGroupDTO[]>>(
        API_ENDPOINTS.VARIANT_GROUPS.LIST_ALL
      );
    } catch (err: any) {
      console.error("Error fetching active variant groups:", err);
      return {
        code: 1,
        message: err.message ?? "Failed to fetch active variant groups",
        data: [],
      };
    }
  },
};

// import { apiConfig } from '@/services/config/api.config';
// import { API_ENDPOINTS } from '@/services/const/api.const';
// import type { VariantGroupDTO } from '@/server/types/dto/v1/product.dto';
// import type { ApiResponse } from '@/server/types/common/api-response';

// export const variantGroupAPI = {
//   getAll: async (): Promise<ApiResponse<VariantGroupDTO[]>> => {
//     try {
//       const res = await fetch(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS.VARIANT_GROUPS.LIST_ALL}`);
//       const data = await res.json();
//       return data;
//     } catch (err: any) {
//       console.error('Error fetching active variant groups:', err);
//       return {
//         code: 1,
//         message: err.message ?? "Failed to fetch active variant groups",
//         data: []
//       };
//     }
//   },
// };