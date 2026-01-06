import { apiAdmin } from "@/services/http/apiAdmin";
import { API_ENDPOINTS_ADMIN } from "@/services/const/api-endpoints-admin";
import type {
  VoucherDTO,
  CreateVoucherBody,
  VoucherPaginationDTO,
} from "@/server/types/dto/v1/voucher.dto";
import type { ApiResponse } from "@/server/types/common/api-response";

export const vouchersAPI = {
  getAll: async (
    page = 1,
    limit = 10,
    filters?: {
      code?: string;
      type?: string | null;
      fromDate?: string;
      toDate?: string;
      reverted?: boolean;
    }
  ): Promise<VoucherPaginationDTO> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters?.code) params.append("code", filters.code);
      if (filters?.type) params.append("type", filters.type);
      if (filters?.fromDate) params.append("fromDate", filters.fromDate);
      if (filters?.toDate) params.append("toDate", filters.toDate);
      if (filters?.reverted !== undefined)
        params.append("reverted", String(filters.reverted));

      const url = `${API_ENDPOINTS_ADMIN.VOUCHERS.LIST}?${params.toString()}`;
      return await apiAdmin().get<VoucherPaginationDTO>(url);
    } catch (err: any) {
      console.error("Error fetching vouchers:", err);
      return {
        code: 1,
        message: "Failed to fetch vouchers",
        data: [],
        pagination: {
          total: 0,
          totalPages: 0,
          page,
          limit,
        },
      };
    }
  },

  getDetail: async (id: string): Promise<ApiResponse<VoucherDTO>> => {
    try {
      return await apiAdmin().get<ApiResponse<VoucherDTO>>(
        API_ENDPOINTS_ADMIN.VOUCHERS.GET_BY_ID(id)
      );
    } catch (err: any) {
      console.error(`Error fetching voucher detail ${id}:`, err);
      throw err;
    }
  },

  create: async (body: CreateVoucherBody): Promise<ApiResponse<VoucherDTO>> => {
    try {
      return await apiAdmin().post<ApiResponse<VoucherDTO>>(
        API_ENDPOINTS_ADMIN.VOUCHERS.CREATE,
        body
      );
    } catch (err: any) {
      console.error("Error creating voucher:", err);
      throw err;
    }
  },

  update: async (
    id: string,
    body: Partial<CreateVoucherBody>
  ): Promise<ApiResponse<VoucherDTO>> => {
    try {
      return await apiAdmin().put<ApiResponse<VoucherDTO>>(
        API_ENDPOINTS_ADMIN.VOUCHERS.UPDATE(id),
        body
      );
    } catch (err: any) {
      console.error(`Error updating voucher ${id}:`, err);
      throw err;
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      return await apiAdmin().delete<ApiResponse<null>>(
        API_ENDPOINTS_ADMIN.VOUCHERS.DELETE(id)
      );
    } catch (err: any) {
      console.error(`Error deleting voucher ${id}:`, err);
      throw err;
    }
  },

  toggleActive: async (id: string): Promise<ApiResponse<VoucherDTO>> => {
    try {
      return await apiAdmin().patch<ApiResponse<VoucherDTO>>(
        API_ENDPOINTS_ADMIN.VOUCHERS.TOGGLE_ACTIVE(id)
      );
    } catch (err: any) {
      console.error(`Error toggling voucher ${id}:`, err);
      throw err;
    }
  },
};

// import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin'
// import type {
//   VoucherDTO,
//   CreateVoucherBody,
//   VoucherPaginationDTO,
// } from '@/server/types/dto/v1/voucher.dto'
// import type { ApiResponse } from '@server/types/common/api-response'

// export const vouchersAPI = {
//   getAll: async (
//     page = 1,
//     limit = 10,
//     filters?: {
//       code?: string
//       type?: string | null
//       fromDate?: string
//       toDate?: string
//       reverted?: boolean
//     }
//   ): Promise<VoucherPaginationDTO> => {
//     try {
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//       })

//       if (filters?.code) params.append('code', filters.code)
//       if (filters?.type) params.append('type', filters.type)
//       if (filters?.fromDate) params.append('fromDate', filters.fromDate)
//       if (filters?.toDate) params.append('toDate', filters.toDate)
//       if (filters?.reverted !== undefined)
//         params.append('reverted', String(filters.reverted))

//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VOUCHERS.LIST}?${params}`)

//       return await response.json()
//     } catch (err) {
//       console.error('Error fetching vouchers:', err)
//       return {
//         code: 1,
//         message: 'Failed to fetch vouchers',
//         data: [],
//         pagination: {
//           total: 0,
//           totalPages: 0,
//           page,
//           limit,
//         },
//       }
//     }
//   },

//   getDetail: async (id: string): Promise<ApiResponse<VoucherDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VOUCHERS.GET_BY_ID(id)}`)

//       if (!response.ok) throw new Error(`Failed to fetch voucher with ID ${id}`)

//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error(`Error fetching voucher detail ${id}:`, err)
//       throw err
//     }
//   },

//   create: async (body: CreateVoucherBody): Promise<ApiResponse<VoucherDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VOUCHERS.CREATE}`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(body),
//         }
//       )

//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error('Error creating voucher:', err)
//       throw err
//     }
//   },

//   update: async (
//     id: string,
//     body: Partial<CreateVoucherBody>
//   ): Promise<ApiResponse<VoucherDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VOUCHERS.UPDATE(id)}`,
//         {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(body),
//         }
//       )

//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error(`Error updating voucher ${id}:`, err)
//       throw err
//     }
//   },

//   delete: async (id: string): Promise<ApiResponse<null>> => {
//     try {
//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VOUCHERS.DELETE(id)}`,
//         {
//           method: 'DELETE',
//         }
//       )

//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error(`Error deleting voucher ${id}:`, err)
//       throw err
//     }
//   },

//   toggleActive: async (id: string): Promise<ApiResponse<VoucherDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VOUCHERS.TOGGLE_ACTIVE(id)}`,
//         {
//           method: 'PATCH',
//         }
//       )

//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error(`Error toggling voucher ${id}:`, err)
//       throw err
//     }
//   },

// }
