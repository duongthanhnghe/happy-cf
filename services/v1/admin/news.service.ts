import { apiConfig } from "@/services/config/api.config"
import { API_ENDPOINTS_ADMIN } from "@/services/const/api-endpoints-admin"
import type { 
  CreatePostNewsDTO, 
  UpdatePostNewsDTO, 
  CreateCategoryNewsDTO, 
  UpdateCategoryNewsDTO, 
  CategoryNewsDTO, 
  PostNewsDTO,
  PostNewsPaginationDTO,
  CategoryNewsPaginationDTO
} from "@/server/types/dto/v1/news.dto"
import type { ApiResponse } from "@server/types/common/api-response"

export const newsAPI = {
  getAllCategories: async (page: number, limit: number,search: string): Promise<CategoryNewsPaginationDTO> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES_NEWS.LIST}?page=${page}&limit=${limit}&search=${search}`, {
        credentials: 'include',
      })
      const data = await response.json()
      return data
    } catch (err: any) {
      console.error("Error fetching categories:", err)
      return {
        code: 1,
        message: err.message ?? "Failed to fetch category news",
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      }
    }
  },

  createCategory: async (bodyData: CreateCategoryNewsDTO): Promise<ApiResponse<CategoryNewsDTO>> => {
    try {
      if (!bodyData.categoryName) {
        return {
          code: 1,
          message: "Thiếu tên danh mục",
          data: null as any
        }
      }

      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES_NEWS.CREATE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(bodyData)
      })

      const data = await response.json()
      return data
    } catch (err: any) {
      console.error("Error creating category:", err)
      return {
        code: 1,
        message: err.message ?? "Failed to create category",
        data: null as any
      }
    }
  },

  getCategoryById: async (id: string): Promise<ApiResponse<CategoryNewsDTO>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES_NEWS.GET_BY_ID(id)}`)
      const data = await response.json()
      return data
    } catch (err: any) {
      console.error(`Error fetching category with ID ${id}:`, err)
      return {
        code: 1,
        message: err.message ?? `Failed to fetch category with ID ${id}`,
        data: null as any
      }
    }
  },

  updateCategory: async (id: string, bodyData: UpdateCategoryNewsDTO): Promise<ApiResponse<CategoryNewsDTO>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES_NEWS.UPDATE(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(bodyData)
      })
      const data = await response.json()
      return data
    } catch (err: any) {
      console.error(`Error updating category with ID ${id}:`, err)
      return {
        code: 1,
        message: err.message ?? "Failed to update category",
        data: null as any
      }
    }
  },

  deleteCategory: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES_NEWS.DELETE(id)}`, {
        method: "DELETE",
        credentials: 'include',
      })
      const data = await response.json()
      return data
    } catch (err: any) {
      console.error(`Error deleting category with ID ${id}:`, err)
      return {
        code: 1,
        message: err.message ?? "Failed to delete category",
        data: null
      }
    }
  },
  toggleActiveCategory: async (id: string): Promise<ApiResponse<CategoryNewsDTO>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES_NEWS.TOGGLE_ACTIVE(id)}`, {
        method: 'PATCH',
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          code: 1,
          message: errorData.message || 'Failed to toggle active status',
          data: undefined as any
        }
      }

      const data: ApiResponse<CategoryNewsDTO> = await response.json()
      return data
    } catch (err) {
      console.error(`Error toggling active status for category news ID ${id}:`, err)
      return {
        code: 1,
        message: 'Unexpected error while toggling active status',
        data: undefined as any
      }
    }
  },
  updateOrderCategory: async (id: string, newOrder: number): Promise<ApiResponse<CategoryNewsDTO>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES_NEWS.UPDATE_ORDER(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ order: newOrder })
      })

      if (!response.ok) { 
        const errorData = await response.json()
        return {
          code: 1,
          message: errorData.message || 'Failed to update order',
          data: undefined as any
        }
      }

      const data: ApiResponse<CategoryNewsDTO> = await response.json()
      return data
    } catch (err) {
      console.error(`Error updating order for category ID ${id}:`, err)
      return {
        code: 1,
        message: 'Unexpected error while updating order',
        data: undefined as any
      }
    }
  },

  // ================== POSTS ==================
  getAllPosts: async (page: number, limit: number, search: string, categoryId:string ): Promise<PostNewsPaginationDTO> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.NEWS_POSTS.LIST}?page=${page}&limit=${limit}&search=${search}&categoryId=${categoryId}`,{
        credentials: 'include',
      })
      const data = await response.json()
      return data
    } catch (err: any) {
      console.error("Error fetching posts:", err)
      return {
        code: 1,
        message: err.message ?? "Failed to fetch posts",
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      }
    }
  },

  createPost: async (bodyData: CreatePostNewsDTO): Promise<ApiResponse<PostNewsDTO>> => {
    try {
      if (!bodyData.title || !bodyData.categoryId || !bodyData.image) {
        return {
          code: 1,
          message: "Thiếu các trường bắt buộc: title, categoryId, image",
          data: null as any
        }
      }

      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.NEWS_POSTS.CREATE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(bodyData)
      })
      const data = await response.json()
      return data
    } catch (err: any) {
      console.error("Error creating post:", err)
      return {
        code: 1,
        message: err.message ?? "Failed to create post",
        data: null as any
      }
    }
  },

  getPostById: async (id: string): Promise<ApiResponse<PostNewsDTO>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.NEWS_POSTS.GET_BY_ID(id)}`)
      const data = await response.json()
      return data
    } catch (err: any) {
      console.error(`Error fetching post with ID ${id}:`, err)
      return {
        code: 1,
        message: err.message ?? `Failed to fetch post with ID ${id}`,
        data: null as any
      }
    }
  },

  updatePost: async (id: string, postData: UpdatePostNewsDTO): Promise<ApiResponse<PostNewsDTO>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.NEWS_POSTS.UPDATE(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: 'include',
        body: JSON.stringify(postData)
      })
      const data = await response.json()
      return data
    } catch (err: any) {
      console.error(`Error updating post with ID ${id}:`, err)
      return {
        code: 1,
        message: err.message ?? "Failed to update post",
        data: null as any
      }
    }
  },

  deletePost: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.NEWS_POSTS.DELETE(id)}`, {
        method: "DELETE",
        credentials: 'include',
      })
      const data = await response.json()
      return data
    } catch (err: any) {
      console.error(`Error deleting post with ID ${id}:`, err)
      return {
        code: 1,
        message: err.message ?? "Failed to delete post",
        data: null
      }
    }
  },

  toggleActivePost: async (id: string): Promise<ApiResponse<PostNewsDTO>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.NEWS_POSTS.TOGGLE_ACTIVE(id)}`, {
        method: 'PATCH',
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          code: 1,
          message: errorData.message || 'Failed to toggle active status',
          data: undefined as any
        }
      }

      const data: ApiResponse<PostNewsDTO> = await response.json()
      return data
    } catch (err) {
      console.error(`Error toggling active status for post ID ${id}:`, err)
      return {
        code: 1,
        message: 'Unexpected error while toggling active status',
        data: undefined as any
      }
    }
  },
}
