import { apiConfig } from '@/config/api.config'
import { API_ENDPOINTS } from '@/const/api.const'
import type { 
  ProductDTO, 
  WishlistItem, 
  CreateProductDTO, 
  UpdateProductDTO,
  PostProductPaginationDTO
} from '@/server/types/dto/product.dto'
import type { ApiResponse } from '@/server/types/common/api-response'

export const productsAPI = {
  // Lấy toàn bộ sản phẩm
  getAll: async (page: number, limit: number): Promise<PostProductPaginationDTO> => {
    try {
      const res = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.LIST_ALL}?page=${page}&limit=${limit}`)
      const data = await res.json()
      return data
    } catch (err: any) {
      console.error('Error fetching all products:', err)
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

  // Tạo mới sản phẩm
  create: async (bodyData: CreateProductDTO): Promise<ApiResponse<ProductDTO>> => {
    try {
      if (!bodyData.productName || !bodyData.image || !bodyData.categoryId || !bodyData.price || !bodyData.priceDiscounts) {
        return {
          code: 1,
          message: "Thiếu dữ liệu bắt buộc",
          data: null as any
        }
      }

      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.CREATE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      })

      const data = await response.json()
      return data
    } catch (err: any) {
      console.error('Error creating product:', err)
      return {
        code: 1,
        message: err.message ?? "Failed to create product",
        data: null as any
      }
    }
  },

  // Chi tiết sản phẩm
  getDetail: async (id: string): Promise<ApiResponse<ProductDTO>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.GET_BY_ID(id)}`)
      const data = await response.json()
      return data
    } catch (err: any) {
      console.error(`Error getting product detail with ID ${id}:`, err)
      return {
        code: 1,
        message: err.message ?? "Failed to fetch product detail",
        data: null as any
      }
    }
  },

  // Cập nhật sản phẩm
  update: async (id: string, bodyData: UpdateProductDTO): Promise<ApiResponse<ProductDTO>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.UPDATE(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      })

      const data = await response.json()
      return data
    } catch (err: any) {
      console.error(`Error updating product with ID ${id}:`, err)
      return {
        code: 1,
        message: err.message ?? "Failed to update product",
        data: null as any
      }
    }
  },

  // Xóa sản phẩm
  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.DELETE(id)}`, {
        method: 'DELETE',
      })

      const data = await response.json()
      return data
    } catch (err: any) {
      console.error(`Error deleting product with ID ${id}:`, err)
      return {
        code: 1,
        message: err.message ?? "Failed to delete product",
        data: null as any
      }
    }
  },

  // Wishlist theo user
  getWishlistByUserId: async (userId: string): Promise<ApiResponse<WishlistItem[]>> => {
    try {
      const res = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.LIST_BY_USER_WISHLIST(userId)}`
      )
      const data = await res.json()
      return data
    } catch (err: any) {
      console.error(`Error fetching wishlist for user ${userId}:`, err)
      return {
        code: 1,
        message: err.message ?? "Failed to fetch wishlist",
        data: []
      }
    }
  },

  // Lấy top sản phẩm được order nhiều nhất
  getMostOrdered: async (limit: number): Promise<ApiResponse<ProductDTO[]>> => {
    try {
      const res = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.LIST_MOST_ORDER(limit)}`)
      const data = await res.json()
      return data
    } catch (err: any) {
      console.error('Error fetching most ordered product:', err)
      return {
        code: 1,
        message: err.message ?? "Failed to fetch most ordered products",
        data: []
      }
    }
  },

  // Thêm wishlist item
  addToWishlist: async (userId: string, productId: string): Promise<ApiResponse<WishlistItem>> => {
    try {
      const res = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.ADD_WISHLIST(userId)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productId }),
        }
      )
      const data = await res.json()
      return data
    } catch (err: any) {
      console.error(`Add wishlist failed:`, err)
      return {
        code: 1,
        message: err.message ?? "Failed to add to wishlist",
        data: null as any
      }
    }
  },

  // Xóa wishlist item
  removeFromWishlist: async (userId: string, productId: string): Promise<ApiResponse<null>> => {
    try {
      const res = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.DELETE_WISHLIST(userId, productId)}`,
        { method: 'DELETE' }
      )
      const data = await res.json()
      return data
    } catch (err: any) {
      console.error(`Remove wishlist failed:`, err)
      return {
        code: 1,
        message: err.message ?? "Failed to remove from wishlist",
        data: null as any
      }
    }
  },
  toggleActive: async (id: string): Promise<ApiResponse<ProductDTO>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.TOGGLE_ACTIVE(id)}`, {
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

      const data: ApiResponse<ProductDTO> = await response.json()
      return data
    } catch (err) {
      console.error(`Error toggling active status for product ID ${id}:`, err)
      return {
        code: 1,
        message: 'Unexpected error while toggling active status',
        data: undefined as any
      }
    }
  },
}
