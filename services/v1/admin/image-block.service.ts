import { API_ENDPOINTS_ADMIN } from "@/services/const/api-endpoints-admin";
import { apiAdmin } from "@/services/http/apiAdmin";
import type { ImageBlockDTO, CreateImageBlockBody, UpdateImageBlockBody } from "@/server/types/dto/v1/image-block.dto";
import type { ApiResponse } from "@server/types/common/api-response";

export const imageBlocksAPI = {
  getAll: async (): Promise<ApiResponse<ImageBlockDTO[]>> => {
    try {
      return await apiAdmin().get<ApiResponse<ImageBlockDTO[]>>(API_ENDPOINTS_ADMIN.IMAGE_BLOCKS.LIST);
    } catch (err: any) {
      console.error("Error fetching image blocks:", err);
      return {
        code: 1,
        message: err.message ?? "Failed to fetch image blocks",
        data: [],
      };
    }
  },

  create: async (bodyData: CreateImageBlockBody): Promise<ApiResponse<ImageBlockDTO>> => {
    try {
      return await apiAdmin().post<ApiResponse<ImageBlockDTO>>(API_ENDPOINTS_ADMIN.IMAGE_BLOCKS.CREATE, bodyData);
    } catch (err: any) {
      console.error("Error creating image block:", err);
      return {
        code: 1,
        message: err.message ?? "Unexpected error while creating image block",
        data: undefined as any,
      };
    }
  },

  getDetail: async (id: string): Promise<ApiResponse<ImageBlockDTO>> => {
    try {
      return await apiAdmin().get<ApiResponse<ImageBlockDTO>>(API_ENDPOINTS_ADMIN.IMAGE_BLOCKS.GET_BY_ID(id));
    } catch (err: any) {
      console.error(`Error getting image block detail ${id}:`, err);
      return {
        code: 1,
        message: err.message ?? `Failed to fetch image block with ID ${id}`,
        data: undefined as any,
      };
    }
  },

  update: async (id: string, bodyData: UpdateImageBlockBody): Promise<ApiResponse<ImageBlockDTO>> => {
    try {
      return await apiAdmin().put<ApiResponse<ImageBlockDTO>>(API_ENDPOINTS_ADMIN.IMAGE_BLOCKS.UPDATE(id), bodyData);
    } catch (err: any) {
      console.error(`Error updating image block ${id}:`, err);
      return {
        code: 1,
        message: err.message ?? `Error updating image block ${id}`,
        data: undefined as any,
      };
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      return await apiAdmin().delete<ApiResponse<null>>(API_ENDPOINTS_ADMIN.IMAGE_BLOCKS.DELETE(id));
    } catch (err: any) {
      console.error(`Error deleting image block ${id}:`, err);
      return {
        code: 1,
        message: err.message ?? `Failed to delete image block ${id}`,
        data: null,
      };
    }
  },

  updateOrder: async (id: string, newOrder: number): Promise<ApiResponse<ImageBlockDTO>> => {
    try {
      return await apiAdmin().patch<ApiResponse<ImageBlockDTO>>(API_ENDPOINTS_ADMIN.IMAGE_BLOCKS.UPDATE_ORDER(id), { order: newOrder });
    } catch (err: any) {
      console.error(`Error updating order for image block ${id}:`, err);
      return {
        code: 1,
        message: err.message ?? "Unexpected error while updating order",
        data: undefined as any,
      };
    }
  },

  toggleActive: async (id: string): Promise<ApiResponse<ImageBlockDTO>> => {
    try {
      return await apiAdmin().patch<ApiResponse<ImageBlockDTO>>(API_ENDPOINTS_ADMIN.IMAGE_BLOCKS.TOGGLE_ACTIVE(id));
    } catch (err: any) {
      console.error(`Error toggling active status for image block ${id}:`, err);
      return {
        code: 1,
        message: err.message ?? "Unexpected error while toggling active",
        data: undefined as any,
      };
    }
  },
};

// import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin'
// import type {
//   ImageBlockDTO,
//   CreateImageBlockBody,
//   UpdateImageBlockBody,
// } from '@/server/types/dto/v1/image-block.dto'
// import type { ApiResponse } from '@server/types/common/api-response'

// export const imageBlocksAPI = {
//   getAll: async (): Promise<ApiResponse<ImageBlockDTO[]>> => {
//     try {
//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.IMAGE_BLOCKS.LIST}`
//       )
//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error('Error fetching image blocks:', err)
//       return {
//         code: 1,
//         message: 'Failed to fetch image blocks',
//         data: []
//       }
//     }
//   },

//   create: async (
//     bodyData: CreateImageBlockBody
//   ): Promise<ApiResponse<ImageBlockDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.IMAGE_BLOCKS.CREATE}`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(bodyData)
//         }
//       )

//       if (!response.ok) {
//         const errorData = await response.json()
//         return {
//           code: 1,
//           message: errorData.message || 'Failed to create image block',
//           data: undefined as any
//         }
//       }

//       const data: ApiResponse<ImageBlockDTO> = await response.json()
//       return data
//     } catch (err) {
//       console.error('Error creating image block:', err)
//       return {
//         code: 1,
//         message: 'Unexpected error while creating image block',
//         data: undefined as any
//       }
//     }
//   },

//   getDetail: async (id: string): Promise<ApiResponse<ImageBlockDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.IMAGE_BLOCKS.GET_BY_ID(id)}`
//       )

//       if (!response.ok) {
//         throw new Error(`Failed to fetch image block with ID ${id}`)
//       }

//       return await response.json()
//     } catch (err) {
//       console.error(`Error getting image block detail ${id}:`, err)
//       throw err
//     }
//   },

//   update: async (
//     id: string,
//     bodyData: UpdateImageBlockBody
//   ): Promise<ApiResponse<ImageBlockDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.IMAGE_BLOCKS.UPDATE(id)}`,
//         {
//           method: 'PUT',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify(bodyData)
//         }
//       )

//       if (!response.ok) {
//         const errorData = await response.json()
//         return {
//           code: 1,
//           message: errorData.message || 'Failed to update image block',
//           data: undefined as any
//         }
//       }

//       return await response.json()
//     } catch (err) {
//       console.error(`Error updating image block ${id}:`, err)
//       return {
//         code: 1,
//         message: `Error updating image block ${id}`,
//         data: undefined as any
//       }
//     }
//   },

//   delete: async (id: string) => {
//     try {
//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.IMAGE_BLOCKS.DELETE(id)}`,
//         { method: 'DELETE' }
//       )

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || `HTTP error ${response.status}`)
//       }

//       return await response.json()
//     } catch (err) {
//       console.error(`Error deleting image block ${id}:`, err)
//       throw err
//     }
//   },

//   updateOrder: async (
//     id: string,
//     newOrder: number
//   ): Promise<ApiResponse<ImageBlockDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.IMAGE_BLOCKS.UPDATE_ORDER(id)}`,
//         {
//           method: 'PATCH',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ order: newOrder })
//         }
//       )

//       if (!response.ok) {
//         const errorData = await response.json()
//         return {
//           code: 1,
//           message: errorData.message || 'Failed to update order',
//           data: undefined as any
//         }
//       }

//       return await response.json()
//     } catch (err) {
//       console.error(`Error updating order image block ${id}:`, err)
//       return {
//         code: 1,
//         message: 'Unexpected error while updating order',
//         data: undefined as any
//       }
//     }
//   },

//   toggleActive: async (id: string): Promise<ApiResponse<ImageBlockDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.IMAGE_BLOCKS.TOGGLE_ACTIVE(id)}`,
//         { method: 'PATCH' }
//       )

//       if (!response.ok) {
//         const errorData = await response.json()
//         return {
//           code: 1,
//           message: errorData.message || 'Failed to toggle active',
//           data: undefined as any
//         }
//       }

//       return await response.json()
//     } catch (err) {
//       console.error(`Error toggling active image block ${id}:`, err)
//       return {
//         code: 1,
//         message: 'Unexpected error while toggling active',
//         data: undefined as any
//       }
//     }
//   },
// }
