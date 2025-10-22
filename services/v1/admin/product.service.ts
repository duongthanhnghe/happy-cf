import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin'
import type { 
  ProductDTO, 
  WishlistItem, 
  CreateProductDTO, 
  UpdateProductDTO,
  ProductPaginationDTO
} from '@/server/types/dto/v1/product.dto'
import type { ApiResponse } from '@/server/types/common/api-response'

export const productsAPI = {
  getAll: async (page: number, limit: number): Promise<ProductPaginationDTO> => {
    try {
      const res = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.LIST_ALL}?page=${page}&limit=${limit}`, {
        credentials: 'include',
      })
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

  create: async (bodyData: CreateProductDTO): Promise<ApiResponse<ProductDTO>> => {
    try {
      if (!bodyData.productName || !bodyData.image || !bodyData.categoryId || !bodyData.price || !bodyData.priceDiscounts) {
        return {
          code: 1,
          message: "Thiếu dữ liệu bắt buộc",
          data: null as any
        }
      }

      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.CREATE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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

  getDetail: async (id: string): Promise<ApiResponse<ProductDTO>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.GET_BY_ID(id)}`)
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

  update: async (id: string, bodyData: UpdateProductDTO): Promise<ApiResponse<ProductDTO>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.UPDATE(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
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

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.DELETE(id)}`, {
        method: 'DELETE',
        credentials: 'include',
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

  // getRelatedBySlug: async (slug: string, limit = 10): Promise<ApiResponse<ProductDTO[]>> => {
  //   try {
  //     const res = await fetch(
  //       `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.RELATED_BY_SLUG(slug)}?limit=${limit}`
  //     )
  //     const data = await res.json()
  //     return data
  //   } catch (err: any) {
  //     console.error(`Error fetching related products by slug ${slug}:`, err)
  //     return {
  //       code: 1,
  //       message: err.message ?? "Failed to fetch related products",
  //       data: []
  //     }
  //   }
  // },

  // // Wishlist theo user
  // getWishlistByUserId: async (userId: string): Promise<ApiResponse<WishlistItem[]>> => {
  //   try {
  //     const res = await fetch(
  //       `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.LIST_BY_USER_WISHLIST(userId)}`
  //     )
  //     const data = await res.json()
  //     return data
  //   } catch (err: any) {
  //     console.error(`Error fetching wishlist for user ${userId}:`, err)
  //     return {
  //       code: 1,
  //       message: err.message ?? "Failed to fetch wishlist",
  //       data: []
  //     }
  //   }
  // },

  // // Lấy top sản phẩm được order nhiều nhất
  // getMostOrdered: async (limit: number): Promise<ApiResponse<ProductDTO[]>> => {
  //   try {
  //     const res = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.LIST_MOST_ORDER(limit)}`)
  //     const data = await res.json()
  //     return data
  //   } catch (err: any) {
  //     console.error('Error fetching most ordered product:', err)
  //     return {
  //       code: 1,
  //       message: err.message ?? "Failed to fetch most ordered products",
  //       data: []
  //     }
  //   }
  // },

  // getPromotional: async (limit: number): Promise<ApiResponse<ProductDTO[]>> => {
  //   try {
  //     const res = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.LIST_PROMOTION(limit)}`)
  //     const data = await res.json()
  //     return data
  //   } catch (err: any) {
  //     console.error('Error fetching promotional products:', err)
  //     return {
  //       code: 1,
  //       message: err.message ?? "Failed to fetch promotional products",
  //       data: []
  //     }
  //   }
  // },

  // search: async (keyword: string, page = 1, limit = 20): Promise<ProductPaginationDTO> => {
  //   try {
  //     const url = `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.SEARCH}?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`
  //     const res = await fetch(url)
  //     const data = await res.json()
  //     return data
  //   } catch (err: any) {
  //     console.error("Error searching products:", err)
  //     return {
  //       code: 1,
  //       message: err.message ?? "Failed to fetch posts",
  //       data: [],
  //       pagination: {
  //         page,
  //         limit,
  //         total: 0,
  //         totalPages: 0
  //       }
  //     }
  //   }
  // },

  // // Thêm wishlist item
  // addToWishlist: async (userId: string, productId: string): Promise<ApiResponse<WishlistItem>> => {
  //   try {
  //     const res = await fetch(
  //       `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.ADD_WISHLIST(userId)}`,
  //       {
  //         method: 'POST',
  //         headers: { 'Content-Type': 'application/json' },
  //         body: JSON.stringify({ productId }),
  //       }
  //     )
  //     const data = await res.json()
  //     return data
  //   } catch (err: any) {
  //     console.error(`Add wishlist failed:`, err)
  //     return {
  //       code: 1,
  //       message: err.message ?? "Failed to add to wishlist",
  //       data: null as any
  //     }
  //   }
  // },

  // // Xóa wishlist item
  // removeFromWishlist: async (userId: string, productId: string): Promise<ApiResponse<null>> => {
  //   try {
  //     const res = await fetch(
  //       `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.DELETE_WISHLIST(userId, productId)}`,
  //       { method: 'DELETE' }
  //     )
  //     const data = await res.json()
  //     return data
  //   } catch (err: any) {
  //     console.error(`Remove wishlist failed:`, err)
  //     return {
  //       code: 1,
  //       message: err.message ?? "Failed to remove from wishlist",
  //       data: null as any
  //     }
  //   }
  // },
  toggleActive: async (id: string): Promise<ApiResponse<ProductDTO>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.TOGGLE_ACTIVE(id)}`, {
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
