import { apiAdmin } from "@/services/http/apiAdmin";
import { API_ENDPOINTS_ADMIN } from "@/services/const/api-endpoints-admin";
import type { 
  VariantGroupDTO, 
  CreateVariantGroupDTO, 
  UpdateVariantGroupDTO 
} from "@/server/types/dto/v1/product.dto";
import type { ApiResponse } from "@/server/types/common/api-response";
import { apiError } from '@/server/types/common/api-response'

export const variantGroupAPI = {
  getAll: async (): Promise<ApiResponse<VariantGroupDTO[]>> => {
    try {
      return await apiAdmin().get<ApiResponse<VariantGroupDTO[]>>(API_ENDPOINTS_ADMIN.VARIANT_GROUPS.LIST_ALL);
    } catch (err: any) {
      console.error("Error fetching all variant groups:", err);
      return apiError<VariantGroupDTO[]>(err)
    }
  },

  getActive: async (): Promise<ApiResponse<VariantGroupDTO[]>> => {
    try {
      return await apiAdmin().get<ApiResponse<VariantGroupDTO[]>>(API_ENDPOINTS_ADMIN.VARIANT_GROUPS.LIST_ACTIVE);
    } catch (err: any) {
      console.error("Error fetching active variant groups:", err);
      return apiError<VariantGroupDTO[]>(err)
    }
  },

  getById: async (id: string): Promise<ApiResponse<VariantGroupDTO>> => {
    try {
      return await apiAdmin().get<ApiResponse<VariantGroupDTO>>(API_ENDPOINTS_ADMIN.VARIANT_GROUPS.DETAIL.replace(":id", id));
    } catch (err: any) {
      console.error(`Error fetching variant group by ID ${id}:`, err);
      return apiError<VariantGroupDTO>(err)
    }
  },

  create: async (bodyData: CreateVariantGroupDTO): Promise<ApiResponse<VariantGroupDTO>> => {
    try {
      return await apiAdmin().post<ApiResponse<VariantGroupDTO>>(API_ENDPOINTS_ADMIN.VARIANT_GROUPS.CREATE, bodyData);
    } catch (err: any) {
      console.error("Error creating variant group:", err);
      return apiError<VariantGroupDTO>(err)
    }
  },

  update: async (id: string, bodyData: UpdateVariantGroupDTO): Promise<ApiResponse<VariantGroupDTO>> => {
    try {
      return await apiAdmin().put<ApiResponse<VariantGroupDTO>>(API_ENDPOINTS_ADMIN.VARIANT_GROUPS.UPDATE.replace(":id", id), bodyData);
    } catch (err: any) {
      console.error(`Error updating variant group ID ${id}:`, err);
      return apiError<VariantGroupDTO>(err)
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      return await apiAdmin().delete<ApiResponse<null>>(API_ENDPOINTS_ADMIN.VARIANT_GROUPS.DELETE.replace(":id", id));
    } catch (err: any) {
      console.error(`Error deleting variant group ID ${id}:`, err);
      return apiError<null>(err)
    }
  },

  toggleActive: async (id: string): Promise<ApiResponse<VariantGroupDTO>> => {
    try {
      return await apiAdmin().patch<ApiResponse<VariantGroupDTO>>(API_ENDPOINTS_ADMIN.VARIANT_GROUPS.TOGGLE_ACTIVE.replace(":id", id));
    } catch (err: any) {
      console.error(`Error toggling active status for variant group ID ${id}:`, err);
      return apiError<VariantGroupDTO>(err)
    }
  },

  getByType: async (type: string): Promise<ApiResponse<VariantGroupDTO[]>> => {
    try {
      return await apiAdmin().get<ApiResponse<VariantGroupDTO[]>>(API_ENDPOINTS_ADMIN.VARIANT_GROUPS.BY_TYPE.replace(":type", type));
    } catch (err: any) {
      console.error(`Error fetching variant groups by type ${type}:`, err);
      return apiError<VariantGroupDTO[]>(err)
    }
  },
};

// import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin';
// import type { 
//   VariantGroupDTO, 
//   CreateVariantGroupDTO, 
//   UpdateVariantGroupDTO 
// } from '@/server/types/dto/v1/product.dto';
// import type { ApiResponse } from '@/server/types/common/api-response';

// export const variantGroupAPI = {
//   getAll: async (): Promise<ApiResponse<VariantGroupDTO[]>> => {
//     try {
//       const res = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VARIANT_GROUPS.LIST_ALL}`);
//       const data = await res.json();
//       return data;
//     } catch (err: any) {
//       console.error('Error fetching all variant groups:', err);
//       return {
//         code: 1,
//         message: err.message ?? "Failed to fetch variant groups",
//         data: []
//       };
//     }
//   },

//   getActive: async (): Promise<ApiResponse<VariantGroupDTO[]>> => {
//     try {
//       const res = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VARIANT_GROUPS.LIST_ACTIVE}`);
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

//   getById: async (id: string): Promise<ApiResponse<VariantGroupDTO>> => {
//     try {
//       const res = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VARIANT_GROUPS.DETAIL.replace(':id', id)}`);
//       const data = await res.json();
//       return data;
//     } catch (err: any) {
//       console.error('Error fetching variant group by ID:', err);
//       return {
//         code: 1,
//         message: err.message ?? "Failed to fetch variant group",
//         data: null as any
//       };
//     }
//   },

//   create: async (bodyData: CreateVariantGroupDTO): Promise<ApiResponse<VariantGroupDTO>> => {
//     try {
//       if (!bodyData.groupName || !bodyData.variants || bodyData.variants.length === 0) {
//         return {
//           code: 1,
//           message: "Thiếu dữ liệu bắt buộc",
//           data: null as any
//         };
//       }

//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VARIANT_GROUPS.CREATE}`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(bodyData)
//         }
//       );

//       const data = await response.json();
//       return data;
//     } catch (err: any) {
//       console.error('Error creating variant group:', err);
//       return {
//         code: 1,
//         message: err.message ?? "Failed to create variant group",
//         data: null as any
//       };
//     }
//   },

//   update: async (id: string, bodyData: UpdateVariantGroupDTO): Promise<ApiResponse<VariantGroupDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VARIANT_GROUPS.UPDATE.replace(':id', id)}`,
//         {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(bodyData)
//         }
//       );

//       const data = await response.json();
//       return data;
//     } catch (err: any) {
//       console.error('Error updating variant group:', err);
//       return {
//         code: 1,
//         message: err.message ?? "Failed to update variant group",
//         data: null as any
//       };
//     }
//   },

//   delete: async (id: string): Promise<ApiResponse<void>> => {
//     try {
//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VARIANT_GROUPS.DELETE.replace(':id', id)}`,
//         {
//           method: 'DELETE',
//         }
//       );

//       const data = await response.json();
//       return data;
//     } catch (err: any) {
//       console.error('Error deleting variant group:', err);
//       return {
//         code: 1,
//         message: err.message ?? "Failed to delete variant group",
//         data: null as any
//       };
//     }
//   },

//   toggleActive: async (id: string): Promise<ApiResponse<VariantGroupDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VARIANT_GROUPS.TOGGLE_ACTIVE.replace(':id', id)}`,
//         {
//           method: 'PATCH',
//         }
//       );

//       const data = await response.json();
//       return data;
//     } catch (err: any) {
//       console.error('Error toggling variant group active:', err);
//       return {
//         code: 1,
//         message: err.message ?? "Failed to toggle variant group",
//         data: null as any
//       };
//     }
//   },

//   getByType: async (type: string): Promise<ApiResponse<VariantGroupDTO[]>> => {
//     try {
//       const res = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VARIANT_GROUPS.BY_TYPE.replace(':type', type)}`);
//       const data = await res.json();
//       return data;
//     } catch (err: any) {
//       console.error('Error fetching variant groups by type:', err);
//       return {
//         code: 1,
//         message: err.message ?? "Failed to fetch variant groups by type",
//         data: []
//       };
//     }
//   },
// };