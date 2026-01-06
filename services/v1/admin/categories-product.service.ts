import { API_ENDPOINTS_ADMIN } from "@/services/const/api-endpoints-admin";
import { apiAdmin } from "@/services/http/apiAdmin";
import type {
  CategoryProductDTO,
  CreateCategoryProductDTO,
  UpdateCategoryProductDTO,
} from "@/server/types/dto/v1/product.dto";
import type { ApiResponse } from "@server/types/common/api-response";
import type { PaginationDTO } from "@/server/types/common/pagination.dto";

export const categoriesAPI = {
  getAll: async (
    page: number,
    limit: number,
    search: string
  ): Promise<PaginationDTO<CategoryProductDTO>> => {
    try {
      return await apiAdmin().get<PaginationDTO<CategoryProductDTO>>(
        `${API_ENDPOINTS_ADMIN.CATEGORIES.LIST}?page=${page}&limit=${limit}&search=${search}`
      );
    } catch (err: any) {
      console.error("Error fetching categories:", err);
      return {
        code: 1,
        message: err.message ?? "Failed to fetch categories",
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      };
    }
  },

  getAllTree: async (): Promise<ApiResponse<CategoryProductDTO[]>> => {
    try {
      return await apiAdmin().get<ApiResponse<CategoryProductDTO[]>>(
        API_ENDPOINTS_ADMIN.CATEGORIES.LIST_TREE
      );
    } catch (err: any) {
      console.error("Error fetching category tree:", err);
      return {
        code: 1,
        message: err.message ?? "Failed to fetch category tree",
        data: [],
      };
    }
  },

  create: async (bodyData: CreateCategoryProductDTO): Promise<ApiResponse<CategoryProductDTO>> => {
    try {
      if (!bodyData.categoryName || !bodyData.image) {
        throw new Error("Missing required fields: categoryName, image");
      }
      return await apiAdmin().post<ApiResponse<CategoryProductDTO>>(
        API_ENDPOINTS_ADMIN.CATEGORIES.CREATE,
        bodyData
      );
    } catch (err: any) {
      console.error("Error creating category:", err);
      return {
        code: 1,
        message: err.message ?? "Unexpected error while creating category",
        data: undefined as any,
      };
    }
  },

  getDetail: async (id: string): Promise<ApiResponse<CategoryProductDTO>> => {
    try {
      return await apiAdmin().get<ApiResponse<CategoryProductDTO>>(
        API_ENDPOINTS_ADMIN.CATEGORIES.GET_BY_ID(id)
      );
    } catch (err: any) {
      console.error(`Error getting category detail with ID ${id}:`, err);
      return {
        code: 1,
        message: err.message ?? `Failed to fetch category with ID ${id}`,
        data: undefined as any,
      };
    }
  },

  update: async (id: string, bodyData: UpdateCategoryProductDTO): Promise<ApiResponse<CategoryProductDTO>> => {
    try {
      const payload = { ...bodyData, _id: bodyData.id };
      return await apiAdmin().put<ApiResponse<CategoryProductDTO>>(
        API_ENDPOINTS_ADMIN.CATEGORIES.UPDATE(id),
        payload
      );
    } catch (err: any) {
      console.error(`Error updating category with ID ${id}:`, err);
      return {
        code: 1,
        message: err.message ?? `Error updating category with ID ${id}`,
        data: undefined as any,
      };
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      return await apiAdmin().delete<ApiResponse<null>>(
        API_ENDPOINTS_ADMIN.CATEGORIES.DELETE(id)
      );
    } catch (err: any) {
      console.error(`Error deleting category with ID ${id}:`, err);
      return {
        code: 1,
        message: err.message ?? `Failed to delete category with ID ${id}`,
        data: null,
      };
    }
  },

  updateOrder: async (id: string, newOrder: number): Promise<ApiResponse<CategoryProductDTO>> => {
    try {
      return await apiAdmin().patch<ApiResponse<CategoryProductDTO>>(
        API_ENDPOINTS_ADMIN.CATEGORIES.UPDATE_ORDER(id),
        { order: newOrder }
      );
    } catch (err: any) {
      console.error(`Error updating order for category ID ${id}:`, err);
      return {
        code: 1,
        message: err.message ?? "Unexpected error while updating order",
        data: undefined as any,
      };
    }
  },

  toggleActive: async (id: string): Promise<ApiResponse<CategoryProductDTO>> => {
    try {
      return await apiAdmin().patch<ApiResponse<CategoryProductDTO>>(
        API_ENDPOINTS_ADMIN.CATEGORIES.TOGGLE_ACTIVE(id)
      );
    } catch (err: any) {
      console.error(`Error toggling active status for category ID ${id}:`, err);
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
// import type { CategoryProductDTO, CreateCategoryProductDTO, UpdateCategoryProductDTO } from '@/server/types/dto/v1/product.dto'
// import type { ApiResponse } from '@server/types/common/api-response'
// import { fetchWithAuthAdmin } from '@/services/helpers/fetchWithAuthAdmin'

// export const categoriesAPI = {
//   getAll: async (page: number, limit: number,search: string) => {
//   try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES.LIST}?page=${page}&limit=${limit}&search=${search}`)
//       const data = await response.json()
//       return data;
//     } catch (err: any) {
//       console.error('Error:', err);
//       return {
//         code: 1,
//         message: err.message ?? "Failed to fetch product",
//         data: [],
//         pagination: {
//           page,
//           limit,
//           total: 0,
//           totalPages: 0
//         }
//       }
//     }
//   },
//   getAllTree: async () => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES.LIST_TREE}`);
//       const data = await response.json();
//       return data;
//     } catch (err) {
//       console.error('Error:', err);
//     }
//   },
//   create: async (bodyData: CreateCategoryProductDTO) => {
//     try {
//       if (!bodyData.categoryName || !bodyData.image) {
//         throw new Error('Missing required fields: categoryName, image')
//       }

//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES.CREATE}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(bodyData)
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
//       }

//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error('Error creating category:', err)
//       throw err
//     }
//   },
//   getDetail: async (id: string) => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES.GET_BY_ID(id)}`)
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
//   update: async (id: string, bodyData: UpdateCategoryProductDTO) => {
//     try {

//       const payload = {
//         ...bodyData,
//         _id: bodyData.id,
//       };

//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES.UPDATE(id)}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(payload)
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
//       }

//       return await response.json()
//     } catch (err) {
//       console.error(`Error updating category with ID ${id}:`, err)
//       throw err
//     }
//   },
//   delete: async (id:string) => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES.DELETE(id)}`, {
//         method: 'DELETE',
//       })

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`)
//       }

//       return await response.json()
//     } catch (err) {
//       console.error(`Error deleting category with ID ${id}:`, err)
//       throw err
//     }
//   },
//   updateOrder: async (id: string, newOrder: number): Promise<ApiResponse<CategoryProductDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES.UPDATE_ORDER(id)}`, {
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

//       const data: ApiResponse<CategoryProductDTO> = await response.json()
//       return data
//     } catch (err) {
//       console.error(`Error updating order for category ID ${id}:`, err)
//       return {
//         code: 1,
//         message: 'Unexpected error while updating order',
//         data: undefined as any
//       }
//     }
//   },
//   toggleActive: async (id: string): Promise<ApiResponse<CategoryProductDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES.TOGGLE_ACTIVE(id)}`, {
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

//       const data: ApiResponse<CategoryProductDTO> = await response.json()
//       return data
//     } catch (err) {
//       console.error(`Error toggling active status for category product ID ${id}:`, err)
//       return {
//         code: 1,
//         message: 'Unexpected error while toggling active status',
//         data: undefined as any
//       }
//     }
//   },
// }