import { API_ENDPOINTS_ADMIN } from "@/services/const/api-endpoints-admin";
import { apiAdmin } from "@/services/http/apiAdmin";
import type { CreateAboutBody, UpdateAboutBody, AboutDTO } from "@/server/types/dto/v1/about.dto";
import type { ApiResponse } from "@server/types/common/api-response";

export const aboutAPI = {
  getAll: async (): Promise<ApiResponse<AboutDTO[]>> => {
    try {
      return await apiAdmin().get<ApiResponse<AboutDTO[]>>(API_ENDPOINTS_ADMIN.ABOUT.LIST);
    } catch (err: any) {
      console.error("Error fetching Abouts:", err);
      return {
        code: 1,
        message: err.message ?? "Failed to fetch Abouts",
        data: [],
      };
    }
  },

  create: async (bodyData: CreateAboutBody): Promise<ApiResponse<AboutDTO>> => {
    try {
      return await apiAdmin().post<ApiResponse<AboutDTO>>(API_ENDPOINTS_ADMIN.ABOUT.CREATE, bodyData);
    } catch (err: any) {
      console.error("Error creating About:", err);
      return {
        code: 1,
        message: err.message ?? "Unexpected error while creating About",
        data: undefined as any,
      };
    }
  },

  getDetail: async (id: string): Promise<ApiResponse<AboutDTO>> => {
    try {
      return await apiAdmin().get<ApiResponse<AboutDTO>>(API_ENDPOINTS_ADMIN.ABOUT.GET_BY_ID(id));
    } catch (err: any) {
      console.error(`Error getting About detail with ID ${id}:`, err);
      return {
        code: 1,
        message: err.message ?? `Failed to fetch About with ID ${id}`,
        data: undefined as any,
      };
    }
  },

  update: async (id: string, bodyData: UpdateAboutBody): Promise<ApiResponse<AboutDTO>> => {
    try {
      return await apiAdmin().put<ApiResponse<AboutDTO>>(API_ENDPOINTS_ADMIN.ABOUT.UPDATE(id), bodyData);
    } catch (err: any) {
      console.error(`Error updating About with ID ${id}:`, err);
      return {
        code: 1,
        message: err.message ?? `Error updating About with ID ${id}`,
        data: undefined as any,
      };
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      return await apiAdmin().delete<ApiResponse<null>>(API_ENDPOINTS_ADMIN.ABOUT.DELETE(id));
    } catch (err: any) {
      console.error(`Error deleting About with ID ${id}:`, err);
      return {
        code: 1,
        message: err.message ?? `Failed to delete About with ID ${id}`,
        data: null,
      };
    }
  },

  updateOrder: async (id: string, newOrder: number): Promise<ApiResponse<AboutDTO>> => {
    try {
      return await apiAdmin().patch<ApiResponse<AboutDTO>>(API_ENDPOINTS_ADMIN.ABOUT.UPDATE_ORDER(id), { order: newOrder });
    } catch (err: any) {
      console.error(`Error updating order for About ID ${id}:`, err);
      return {
        code: 1,
        message: err.message ?? "Unexpected error while updating order",
        data: undefined as any,
      };
    }
  },

  toggleActive: async (id: string): Promise<ApiResponse<AboutDTO>> => {
    try {
      return await apiAdmin().patch<ApiResponse<AboutDTO>>(API_ENDPOINTS_ADMIN.ABOUT.TOGGLE_ACTIVE(id));
    } catch (err: any) {
      console.error(`Error toggling active status for About ID ${id}:`, err);
      return {
        code: 1,
        message: err.message ?? "Unexpected error while toggling active status",
        data: undefined as any,
      };
    }
  },
};


// import { apiConfig } from '@/services/config/api.config'
// import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin'
// import type { CreateAboutBody, UpdateAboutBody, AboutDTO } from '@/server/types/dto/v1/about.dto'
// import type { ApiResponse } from '@server/types/common/api-response'
// import { fetchWithAuthAdmin } from '@/services/helpers/fetchWithAuthAdmin'

// export const aboutAPI = {
//   getAll: async (): Promise<ApiResponse<AboutDTO[]>> => {
//   try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ABOUT.LIST}`)
//       const data = await response.json()
//       return data;
//     } catch (err) {
//       console.error('Error:', err)
//       return {
//         code: 1,
//         message: 'Failed to fetch Abouts',
//         data: []
//       }
//     }
//   },
//   create: async (bodyData:CreateAboutBody): Promise<ApiResponse<AboutDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ABOUT.CREATE}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(bodyData)
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         return {
//           code: 1,
//           message: errorData,
//           data: undefined as any
//         }
//       }

//       const data:ApiResponse<AboutDTO> = await response.json()
//       return data
//     } catch (err) {
//       console.error('Error creating category:', err)
//       return {
//         code: 1,
//         message: 'Unexpected error while creating About',
//         data: undefined as any
//       }
//     }
//   },
//   getDetail: async (id:string): Promise<ApiResponse<AboutDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ABOUT.GET_BY_ID(id)}`)
//       if (!response.ok) {
//         throw new Error(`Failed to fetch category with ID ${id}`)
//       }
//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error(`Error getting category detail with ID ${id}:`, err)
//       throw err
//     }
//   },
//   update: async (id:string, bodyData:UpdateAboutBody): Promise<ApiResponse<AboutDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ABOUT.UPDATE(id)}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(bodyData)
//       })
    
//       if (!response.ok) {
//         const errorData = await response.json()
//         return {
//           code: 1,
//           message: errorData,
//           data: undefined as any
//         }
//       }
      
//       const data:ApiResponse<AboutDTO> = await response.json()
//       return data
//     } catch (err) {
//       console.error(`Error updating About with ID ${id}:`, err)
//       return {
//         code: 1,
//         message: `Error updating About with ID ${id}:`,
//         data: undefined as any
//       }
//     }
//   },
//   delete: async (id: string) => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ABOUT.DELETE(id)}`, {
//         method: 'DELETE',
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
//       }

//       return await response.json()
//     } catch (err) {
//       console.error(`Error deleting category with ID ${id}:`, err)
//       throw err
//     }
//   },
//   updateOrder: async (id: string, newOrder: number): Promise<ApiResponse<AboutDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ABOUT.UPDATE_ORDER(id)}`, {
//         method: 'PATCH',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ order: newOrder })
//       })

//       if (!response.ok) { 
//         const errorData = await response.json()
//         return {
//           code: 1,
//           message: errorData.message || 'Failed to update order',
//           data: undefined as any
//         }
//       }

//       const data: ApiResponse<AboutDTO> = await response.json()
//       return data
//     } catch (err) {
//       console.error(`Error updating order for About ID ${id}:`, err)
//       return {
//         code: 1,
//         message: 'Unexpected error while updating order',
//         data: undefined as any
//       }
//     }
//   },
//   toggleActive: async (id: string): Promise<ApiResponse<AboutDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ABOUT.TOGGLE_ACTIVE(id)}`, {
//         method: 'PATCH',
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         return {
//           code: 1,
//           message: errorData.message || 'Failed to toggle active status',
//           data: undefined as any
//         }
//       }

//       const data: ApiResponse<AboutDTO> = await response.json()
//       return data
//     } catch (err) {
//       console.error(`Error toggling active status for banner ID ${id}:`, err)
//       return {
//         code: 1,
//         message: 'Unexpected error while toggling active status',
//         data: undefined as any
//       }
//     }
//   },
// }