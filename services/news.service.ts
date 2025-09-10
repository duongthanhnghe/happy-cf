import { apiConfig } from "@/config/api.config"
import { API_ENDPOINTS } from "@/const/api.const"
import type { 
  CreatePostNewsDTO, 
  UpdatePostNewsDTO, 
  CreateCategoryNewsDTO, 
  UpdateCategoryNewsDTO, 
  CategoryNewsDTO, 
  PostNewsDTO 
} from "@server/types/dto/news.dto"
import type { ApiResponse } from "@server/types/common/api-response"

export const newsAPI = {
  getAllCategories: async (): Promise<ApiResponse<CategoryNewsDTO[]>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES_NEWS.LIST}`)
      const data = await response.json()
      return data
    } catch (err) {
      console.error("Error fetching categories:", err)
      return {
        code: 1,
        message: "Failed to fetch categories news",
        data: []
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

      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES_NEWS.CREATE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES_NEWS.GET_BY_ID(id)}`)
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

  getCategoryBySlug: async (slug: string): Promise<ApiResponse<CategoryNewsDTO>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES_NEWS.GET_BY_SLUG(slug)}`)
      return await response.json()
    } catch (err: any) {
      console.error(`Error fetching category with slug ${slug}:`, err)
      return { code: 1, message: err.message ?? "Failed to fetch category by slug", data: null as any }
    }
  },

  updateCategory: async (id: string, bodyData: UpdateCategoryNewsDTO): Promise<ApiResponse<CategoryNewsDTO>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES_NEWS.UPDATE(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES_NEWS.DELETE(id)}`, {
        method: "DELETE",
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

  // ================== POSTS ==================
  getAllPosts: async (): Promise<ApiResponse<PostNewsDTO[]>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.NEWS_POSTS.LIST}`)
      const data = await response.json()
      return data
    } catch (err: any) {
      console.error("Error fetching posts:", err)
      return {
        code: 1,
        message: err.message ?? "Failed to fetch posts",
        data: []
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

      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.NEWS_POSTS.CREATE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
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
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.NEWS_POSTS.GET_BY_ID(id)}`)
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
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.NEWS_POSTS.UPDATE(id)}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
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
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.NEWS_POSTS.DELETE(id)}`, {
        method: "DELETE",
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

  getLatestPosts: async (limit: number): Promise<ApiResponse<PostNewsDTO[]>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.NEWS_POSTS.LATEST(limit)}`)
      const data = await response.json()
      return data
    } catch (err: any) {
      console.error("Error fetching latest posts:", err)
      return {
        code: 1,
        message: err.message ?? "Failed to fetch latest posts",
        data: []
      }
    }
  },
  toggleActivePost: async (id: string): Promise<ApiResponse<PostNewsDTO>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.NEWS_POSTS.TOGGLE_ACTIVE(id)}`, {
        method: 'PATCH',
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
  toggleActiveCategory: async (id: string): Promise<ApiResponse<CategoryNewsDTO>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES_NEWS.TOGGLE_ACTIVE(id)}`, {
        method: 'PATCH',
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
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.CATEGORIES_NEWS.UPDATE_ORDER(id)}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
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
  getPostsByCategory: async (
    id: string,
    page: number,
    limit: number
  ): Promise<ApiResponse<{ posts: PostNewsDTO[]; pagination: { page: number; limit: number; total: number; totalPages: number } }>> => {
    try {
      const response = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.NEWS_POSTS.GET_BY_CATEGORY(id)}?page=${page}&limit=${limit}`
      )

      if (!response.ok) {
        const errorData = await response.json()
        return {
          code: 1,
          message: errorData.message || "Failed to fetch posts by category",
          data: { posts: [], pagination: { page, limit, total: 0, totalPages: 0 } }
        }
      }

      const data: ApiResponse<{ posts: PostNewsDTO[]; pagination: { page: number; limit: number; total: number; totalPages: number } }> =
        await response.json()

      return data
    } catch (err: any) {
      console.error(`Error fetching posts by category slug "${id}":`, err)
      return {
        code: 1,
        message: err.message || "Unexpected error while fetching posts by category",
        data: { posts: [], pagination: { page, limit, total: 0, totalPages: 0 } }
      }
    }
  },
}
