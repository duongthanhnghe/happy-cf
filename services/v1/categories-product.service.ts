import { apiClient } from '@/services/http/apiClient'
import { API_ENDPOINTS } from '@/services/const/api.const'
import type { ApiResponse } from '@/server/types/common/api-response'
import type { CategoryProductDTO } from '@/server/types/dto/v1/product.dto'

export const categoriesAPI = {
  getAll: async (): Promise<ApiResponse<CategoryProductDTO[]>> => {
    try {
      return await apiClient().get<ApiResponse<CategoryProductDTO[]>>(API_ENDPOINTS.CATEGORIES.LIST)
    } catch (err: any) {
      console.error('[categoriesAPI.getAll]', err)
      return {
        code: 1,
        message: err.message ?? 'Failed to fetch categories',
        data: [],
      }
    }
  },

  getAllTree: async (): Promise<ApiResponse<CategoryProductDTO[]>> => {
    try {
      return await apiClient().get<ApiResponse<CategoryProductDTO[]>>(API_ENDPOINTS.CATEGORIES.LIST_TREE)
    } catch (err: any) {
      console.error('[categoriesAPI.getAllTree]', err)
      return {
        code: 1,
        message: err.message ?? 'Failed to fetch categories tree',
        data: [],
      }
    }
  },

  getChildren: async (
    parentId: string,
    includeInactive = false
  ): Promise<ApiResponse<CategoryProductDTO[]>> => {
    try {
      return await apiClient().get<ApiResponse<CategoryProductDTO[]>>(
        API_ENDPOINTS.CATEGORIES.GET_CHILDREN(parentId),
        { includeInactive }
      )
    } catch (err: any) {
      console.error(`[categoriesAPI.getChildren] parentId=${parentId}`, err)
      return {
        code: 1,
        message: err.message ?? 'Failed to fetch child categories',
        data: [],
      }
    }
  },

  getDetail: async (id: string): Promise<ApiResponse<CategoryProductDTO>> => {
    try {
      return await apiClient().get<ApiResponse<CategoryProductDTO>>(API_ENDPOINTS.CATEGORIES.GET_BY_ID(id))
    } catch (err: any) {
      console.error(`[categoriesAPI.getDetail] id=${id}`, err)
      return {
        code: 1,
        message: err.message ?? `Failed to fetch category with ID ${id}`,
        data: null as any,
      }
    }
  },

  getDetailBySlug: async (slug: string): Promise<ApiResponse<CategoryProductDTO>> => {
    try {
      return await apiClient().get<ApiResponse<CategoryProductDTO>>(API_ENDPOINTS.CATEGORIES.GET_BY_SLUG(slug))
    } catch (err: any) {
      console.error(`[categoriesAPI.getDetailBySlug] slug=${slug}`, err)
      return {
        code: 1,
        message: err.message ?? `Failed to fetch category with slug ${slug}`,
        data: null as any,
      }
    }
  },
}


// import { API_ENDPOINTS } from '@/services/const/api.const'

// export const categoriesAPI = {
//   getAll: async () => {
//   try {
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES.LIST}`)
//       const data = await response.json()
//       return data;
//     } catch (err) {
//       console.error('Error:', err)
//     }
//   },
//   getAllTree: async () => {
//     try {
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES.LIST_TREE}`);
//       const data = await response.json();
//       return data;
//     } catch (err) {
//       console.error('Error:', err);
//     }
//   },
//   getChildren: async (parentId: string, includeInactive = false) => {
//     try {
//       const params = new URLSearchParams({
//         includeInactive: String(includeInactive),
//       })

//       const res = await fetch(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES.GET_CHILDREN(parentId)}?${params.toString()}`
//       )

//       return await res.json()
//     } catch (err) {
//       console.error("Error fetching child categories:", err)
//       throw err
//     }
//   },
//   getDetail: async (id: string) => {
//     try {
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES.GET_BY_ID(id)}`)
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
//   getDetailBySlug: async (slug: string) => {
//     try {
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES.GET_BY_SLUG(slug)}`)
//       if (!response.ok) {
//         throw new Error(`Failed to fetch category with slug ${slug}`)
//       }
//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error(`Error getting category detail with slug ${slug}:`, err)
//       throw err
//     }
//   },
// }