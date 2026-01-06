import { apiClient } from '../http/apiClient'
import { API_ENDPOINTS } from '@/services/const/api.const'
import type { 
  CategoryNewsDTO, 
  PostNewsDTO,
  PostNewsPaginationDTO
} from '@/server/types/dto/v1/news.dto'
import type { ApiResponse } from '@server/types/common/api-response'

export const newsAPI = {
  getAllCategories: async (): Promise<ApiResponse<CategoryNewsDTO[]>> => {
    try {
      const result = await apiClient().get<ApiResponse<CategoryNewsDTO[]>>(API_ENDPOINTS.CATEGORIES_NEWS.LIST)
      if (result.code !== 0) throw new Error(result.message || 'Failed to fetch categories news')
      return result
    } catch (err: any) {
      console.error('[newsAPI.getAllCategories]', err)
      return { code: 1, message: err.message ?? 'Failed to fetch categories news', data: [] }
    }
  },

  getCategoryById: async (id: string): Promise<ApiResponse<CategoryNewsDTO>> => {
    try {
      const result = await apiClient().get<ApiResponse<CategoryNewsDTO>>(API_ENDPOINTS.CATEGORIES_NEWS.GET_BY_ID(id))
      if (result.code !== 0) throw new Error(result.message || `Failed to fetch category with ID ${id}`)
      return result
    } catch (err: any) {
      console.error(`[newsAPI.getCategoryById] ID: ${id}`, err)
      return { code: 1, message: err.message ?? `Failed to fetch category with ID ${id}`, data: null as any }
    }
  },

  getCategoryBySlug: async (slug: string): Promise<ApiResponse<CategoryNewsDTO>> => {
    try {
      const result = await apiClient().get<ApiResponse<CategoryNewsDTO>>(API_ENDPOINTS.CATEGORIES_NEWS.GET_BY_SLUG(slug))
      if (result.code !== 0) throw new Error(result.message || `Failed to fetch category with slug ${slug}`)
      return result
    } catch (err: any) {
      console.error(`[newsAPI.getCategoryBySlug] slug: ${slug}`, err)
      return { code: 1, message: err.message ?? `Failed to fetch category by slug`, data: null as any }
    }
  },

  getPostById: async (id: string): Promise<ApiResponse<PostNewsDTO>> => {
    try {
      const result = await apiClient().get<ApiResponse<PostNewsDTO>>(API_ENDPOINTS.NEWS_POSTS.GET_BY_ID(id))
      if (result.code !== 0) throw new Error(result.message || `Failed to fetch post with ID ${id}`)
      return result
    } catch (err: any) {
      console.error(`[newsAPI.getPostById] ID: ${id}`, err)
      return { code: 1, message: err.message ?? `Failed to fetch post with ID ${id}`, data: null as any }
    }
  },

  getPostBySlug: async (slug: string): Promise<ApiResponse<PostNewsDTO>> => {
    try {
      const result = await apiClient().get<ApiResponse<PostNewsDTO>>(API_ENDPOINTS.NEWS_POSTS.GET_BY_SLUG(slug))
      if (result.code !== 0) throw new Error(result.message || `Failed to fetch post with slug ${slug}`)
      return result
    } catch (err: any) {
      console.error(`[newsAPI.getPostBySlug] slug: ${slug}`, err)
      return { code: 1, message: err.message ?? `Failed to fetch post with slug ${slug}`, data: null as any }
    }
  },

  getLatestPosts: async (limit: number): Promise<ApiResponse<PostNewsDTO[]>> => {
    try {
      const result = await apiClient().get<ApiResponse<PostNewsDTO[]>>(API_ENDPOINTS.NEWS_POSTS.LATEST(limit))
      if (result.code !== 0) throw new Error(result.message || 'Failed to fetch latest posts')
      return result
    } catch (err: any) {
      console.error('[newsAPI.getLatestPosts]', err)
      return { code: 1, message: err.message ?? 'Failed to fetch latest posts', data: [] }
    }
  },

  getPostsByCategory: async (
    id: string,
    page: number,
    limit: number
  ): Promise<ApiResponse<{ posts: PostNewsDTO[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>> => {
    try {
      const params = { page, limit }
      const result = await apiClient().get<ApiResponse<{ posts: PostNewsDTO[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>>(
        API_ENDPOINTS.NEWS_POSTS.GET_BY_CATEGORY(id),
        params
      )
      if (result.code !== 0) throw new Error(result.message || 'Failed to fetch posts by category')
      return result
    } catch (err: any) {
      console.error(`[newsAPI.getPostsByCategory] ID: ${id}`, err)
      return {
        code: 1,
        message: err.message ?? 'Failed to fetch posts by category',
        data: { posts: [], pagination: { page, limit, total: 0, totalPages: 0 } }
      }
    }
  },

  getRelatedPosts: async (slug: string, limit: number): Promise<ApiResponse<PostNewsDTO[]>> => {
    try {
      const params = { limit }
      const result = await apiClient().get<ApiResponse<PostNewsDTO[]>>(API_ENDPOINTS.NEWS_POSTS.RELATED_BY_SLUG(slug), params)
      if (result.code !== 0) throw new Error(result.message || 'Failed to fetch related posts')
      return result
    } catch (err: any) {
      console.error(`[newsAPI.getRelatedPosts] slug: ${slug}`, err)
      return { code: 1, message: err.message ?? 'Failed to fetch related posts', data: [] }
    }
  },

  updateViews: async (slug: string): Promise<ApiResponse<null>> => {
    try {
      return await apiClient().patch<ApiResponse<null>>(API_ENDPOINTS.NEWS_POSTS.UPDATE_VIEWS(slug))
    } catch (err: any) {
      console.error(`[newsAPI.updateViews] slug: ${slug}`, err)
      return { code: 1, message: err.message ?? 'Failed to update views', data: null }
    }
  },

  getAllPostsPagination: async (
    page: number|string,
    limit: number,
    search: string = ""
  ): Promise<PostNewsPaginationDTO> => {
    try {
      const params = { page, limit, search }
      const result = await apiClient().get<PostNewsPaginationDTO>(API_ENDPOINTS.NEWS_POSTS.LIST_PAGINATION, params)
      if (result.code !== 0) throw new Error(result.message || 'Failed to fetch posts')
      return result
    } catch (err: any) {
      console.error('[newsAPI.getAllPostsPagination]', err)
      return {
        code: 1,
        message: err.message ?? 'Failed to fetch posts',
        data: [],
        pagination: {
          page: 1,
          limit,
          total: 0,
          totalPages: 0
        }
      }
    }
  }
}

// import { apiConfig } from "@/services/config/api.config"
// import { API_ENDPOINTS } from "@/services/const/api.const"
// import type { 
//   CategoryNewsDTO, 
//   PostNewsDTO,
//   PostNewsPaginationDTO
// } from "@/server/types/dto/v1/news.dto"
// import type { ApiResponse } from "@server/types/common/api-response"

// export const newsAPI = {
//   getAllCategories: async (): Promise<ApiResponse<CategoryNewsDTO[]>> => {
//     try {
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES_NEWS.LIST}`)
//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error("Error fetching categories:", err)
//       return {
//         code: 1,
//         message: "Failed to fetch categories news",
//         data: []
//       }
//     }
//   },

//   getCategoryById: async (id: string): Promise<ApiResponse<CategoryNewsDTO>> => {
//     try {
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES_NEWS.GET_BY_ID(id)}`)
//       const data = await response.json()
//       return data
//     } catch (err: any) {
//       console.error(`Error fetching category with ID ${id}:`, err)
//       return {
//         code: 1,
//         message: err.message ?? `Failed to fetch category with ID ${id}`,
//         data: null as any
//       }
//     }
//   },

//   getCategoryBySlug: async (slug: string): Promise<ApiResponse<CategoryNewsDTO>> => {
//     try {
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES_NEWS.GET_BY_SLUG(slug)}`)
//       return await response.json()
//     } catch (err: any) {
//       console.error(`Error fetching category with slug ${slug}:`, err)
//       return { code: 1, message: err.message ?? "Failed to fetch category by slug", data: null as any }
//     }
//   },

//   getPostById: async (id: string): Promise<ApiResponse<PostNewsDTO>> => {
//     try {
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.NEWS_POSTS.GET_BY_ID(id)}`)
//       const data = await response.json()
//       return data
//     } catch (err: any) {
//       console.error(`Error fetching post with ID ${id}:`, err)
//       return {
//         code: 1,
//         message: err.message ?? `Failed to fetch post with ID ${id}`,
//         data: null as any
//       }
//     }
//   },

//   getPostBySlug: async (slug: string): Promise<ApiResponse<PostNewsDTO>> => {
//     try {
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.NEWS_POSTS.GET_BY_SLUG(slug)}`)
//       const data = await response.json()
//       return data
//     } catch (err: any) {
//       console.error(`Error fetching post with slug ${slug}:`, err)
//       return {
//         code: 1,
//         message: err.message ?? `Failed to fetch post with slug ${slug}`,
//         data: null as any
//       }
//     }
//   },

//   getLatestPosts: async (limit: number): Promise<ApiResponse<PostNewsDTO[]>> => {
//     try {
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.NEWS_POSTS.LATEST(limit)}`)
//       const data = await response.json()
//       return data
//     } catch (err: any) {
//       console.error("Error fetching latest posts:", err)
//       return {
//         code: 1,
//         message: err.message ?? "Failed to fetch latest posts",
//         data: []
//       }
//     }
//   },
  
//   getPostsByCategory: async (
//     id: string,
//     page: number,
//     limit: number
//   ): Promise<ApiResponse<{ posts: PostNewsDTO[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>> => {
//     try {
//       const response = await fetch(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS.NEWS_POSTS.GET_BY_CATEGORY(id)}?page=${page}&limit=${limit}`
//       )

//       if (!response.ok) {
//         const errorData = await response.json()
//         return {
//           code: 1,
//           message: errorData.message || "Failed to fetch posts by category",
//           data: { posts: [], pagination: { page, limit, total: 0, totalPages: 0 } }
//         }
//       }

//       const data: ApiResponse<{ posts: PostNewsDTO[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> =
//         await response.json()

//       return data
//     } catch (err: any) {
//       console.error(`Error fetching posts by category slug "${id}":`, err)
//       return {
//         code: 1,
//         message: err.message || "Unexpected error while fetching posts by category",
//         data: { posts: [], pagination: { page, limit, total: 0, totalPages: 0 } }
//       }
//     }
//   },
//   getRelatedPosts: async (slug: string, limit: number): Promise<ApiResponse<PostNewsDTO[]>> => {
//     try {
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.NEWS_POSTS.RELATED_BY_SLUG(slug)}?limit=${limit}`)
//       const data = await response.json()
//       return data
//     } catch (err: any) {
//       return {
//         code: 1,
//         message: err.message ?? `Failed to fetch related posts for slug ${slug}`,
//         data: [],
//       }
//     }
//   },
//   updateViews: async (slug: string): Promise<ApiResponse<null>> => {
//     try {
//       const response = await fetch(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS.NEWS_POSTS.UPDATE_VIEWS(slug)}`,
//         {
//           method: "PATCH",
//           headers: {
//             "Content-Type": "application/json",
//           },
//         }
//       )

//       if (!response.ok) {
//         const errorData = await response.json()
//         return {
//           code: 1,
//           message: errorData.message || `Failed to update views for slug "${slug}"`,
//           data: null,
//         }
//       }

//       const data: ApiResponse<null> = await response.json()
//       return data
//     } catch (err: any) {
//       console.error(`Error updating views for slug "${slug}":`, err)
//       return {
//         code: 1,
//         message: err.message || "Unexpected error while updating views",
//         data: null,
//       }
//     }
//   },

//   getAllPostsPagination: async (
//     page: number|string,
//     limit: number,
//     search: string = ""
//   ): Promise<PostNewsPaginationDTO> => {
//     try {
//       const response = await fetch(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS.NEWS_POSTS.LIST_PAGINATION}?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`
//       )
//       const data = await response.json()
//       return data
//     } catch (err: any) {
//       console.error("Error fetching posts:", err)
//       return {
//         code: 1,
//         message: err.message ?? "Failed to fetch posts",
//         data: [],
//         pagination: {
//           page: 1,
//           limit,
//           total: 0,
//           totalPages: 0
//         }
//       }
//     }
//   }
// }