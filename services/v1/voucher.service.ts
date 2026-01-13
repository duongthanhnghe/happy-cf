import { API_ENDPOINTS } from "@/services/const/api.const";
import { apiClient } from "../http/apiClient";
import type {
  ApplyVoucherProduct,
  ApplyVoucherResponse,
  VoucherAvailableDTO,
} from "@/server/types/dto/v1/voucher.dto";
import type { ApiResponse } from "@server/types/common/api-response";
import { apiError } from "@/server/types/common/api-response"

export const vouchersAPI = {
  apply: async (
    payload: {
      code: string;
      orderTotal: number;
      products?: ApplyVoucherProduct[];
      orderCreatedAt?: string;
      userId: string;
    }
  ): Promise<ApiResponse<ApplyVoucherResponse>> => {
    try {
      return await apiClient().authPost<ApiResponse<ApplyVoucherResponse>>(
        API_ENDPOINTS.VOUCHERS.APPLY,
        payload
      );
    } catch (err: any) {
      console.error("Error applying voucher:", err);
      return apiError<ApplyVoucherResponse>(err)
    }
  },

  getAvailable: async (body: {
    orderTotal: number;
    categoryIds?: string[];
    userId?: string;
  }): Promise<ApiResponse<VoucherAvailableDTO[]>> => {
    try {
      return await apiClient().post<ApiResponse<VoucherAvailableDTO[]>>(
        API_ENDPOINTS.VOUCHERS.AVAILABLE,
        body
      );
    } catch (err: any) {
      console.error("Error fetching available vouchers for order:", err);
      return apiError<VoucherAvailableDTO[]>(err)
    }
  },

  getAll: async (): Promise<ApiResponse<VoucherAvailableDTO[]>> => {
    try {
      return await apiClient().get<ApiResponse<VoucherAvailableDTO[]>>(
        API_ENDPOINTS.VOUCHERS.ALL
      );
    } catch (err: any) {
      console.error("Error fetching all vouchers:", err);
      return apiError<VoucherAvailableDTO[]>(err)
    }
  },
};

// import { API_ENDPOINTS } from '@/services/const/api.const'
// import type {
//   ApplyVoucherProduct,
//   ApplyVoucherResponse,
//   VoucherAvailableDTO,
// } from '@/server/types/dto/v1/voucher.dto'
// import type { ApiResponse } from '@server/types/common/api-response'

// export const vouchersAPI = {
//   apply: async (
//     payload: {
//       code: string
//       orderTotal: number
//       products?: ApplyVoucherProduct[]
//       orderCreatedAt?: string
//       userId: string
//     }
//   ): Promise<ApiResponse<ApplyVoucherResponse>> => {
//     try {
//       const response = await fetchWithAuth(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS.VOUCHERS.APPLY}`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(payload),
//         }
//       )

//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error('Error applying voucher:', err)
//       throw err
//     }
//   },
//   getAvailable: async (body: {
//     orderTotal: number
//     categoryIds?: string[]
//     userId?: string
//   }): Promise<ApiResponse<VoucherAvailableDTO[]>> => {
//     try {
//       const response = await fetch(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS.VOUCHERS.AVAILABLE}`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(body),
//         }
//       )

//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error('Error fetching available vouchers for order:', err)
//       return {
//         code: 1,
//         message: 'Không thể lấy danh sách voucher khả dụng',
//         data: [],
//       } as ApiResponse<VoucherAvailableDTO[]>
//     }
//   },

//   getAll: async (): Promise<ApiResponse<VoucherAvailableDTO[]>> => {
//     try {
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.VOUCHERS.ALL}`)

//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error('Error fetching available vouchers for order:', err)
//       return {
//         code: 1,
//         message: 'Không thể lấy danh sách voucher khả dụng',
//         data: [],
//       } as ApiResponse<VoucherAvailableDTO[]>
//     }
//   },

// }
