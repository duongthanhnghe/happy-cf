import { apiAdmin } from "@/services/http/apiAdmin";
import { API_ENDPOINTS_ADMIN } from "@/services/const/api-endpoints-admin";
import type { VoucherUsagePaginationDTO } from "@/server/types/dto/v1/voucher-usage.dto";

export const vouchersUsageAPI = {
  getAll: async (
    page = 1,
    limit = 10,
    options?: {
      code?: string;
      type?: string | null;
      fromDate?: string;
      toDate?: string;
      reverted?: boolean;
      userId?: string;
    }
  ): Promise<VoucherUsagePaginationDTO> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (options?.code) params.append("code", options.code);
      if (options?.type) params.append("type", options.type);
      if (options?.fromDate) params.append("fromDate", options.fromDate);
      if (options?.toDate) params.append("toDate", options.toDate);
      if (options?.reverted !== undefined) params.append("reverted", String(options.reverted));
      if (options?.userId) params.append("userId", options.userId);

      const url = `${API_ENDPOINTS_ADMIN.VOUCHERS_USAGE.LIST}?${params.toString()}`;

      return await apiAdmin().get<VoucherUsagePaginationDTO>(url);
    } catch (err: any) {
      console.error("Error fetching voucher usage:", err);
      return {
        code: 1,
        message: "Failed to fetch voucher usage",
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0,
        },
      };
    }
  },
};

// import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin'
// import type { VoucherUsagePaginationDTO } from '@/server/types/dto/v1/voucher-usage.dto'
// import { fetchWithAuthAdmin } from '@/services/helpers/fetchWithAuthAdmin'

// export const vouchersUsageAPI = {
//   getAll: async (
//     page = 1,
//     limit = 10,
//     options?: {
//       code?: string
//       type?: string | null
//       fromDate?: string
//       toDate?: string
//       reverted?: boolean
//       userId?: string
//     }
//   ): Promise<VoucherUsagePaginationDTO> => {
//     try {
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//       })

//       if (options?.code) params.append('code', options.code)
//       if (options?.type) params.append('type', options.type)
//       if (options?.fromDate) params.append('fromDate', options.fromDate)
//       if (options?.toDate) params.append('toDate', options.toDate)
//       if (options?.reverted !== undefined)
//         params.append('reverted', String(options.reverted))
//       if (options?.userId) params.append('userId', options.userId)

//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VOUCHERS_USAGE.LIST}?${params}`)

//       return await response.json()
//     } catch (err) {
//       console.error('Error fetching voucher usage:', err)
//       return {
//         code: 1,
//         message: 'Failed to fetch voucher usage',
//         data: [],
//         pagination: {
//           page,
//           limit,
//           total: 0,
//           totalPages: 0,
//         },
//       }
//     }
//   },

// }
