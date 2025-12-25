import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS } from '@/services/const/api.const'
import type { 
  ProductDTO, 
  WishlistItem, 
  ProductPaginationDTO,
  ProductSortType
} from '@/server/types/dto/v1/product.dto'
import type { ApiResponse } from '@/server/types/common/api-response'
import { fetchWithAuth } from '../helpers/fetchWithAuth' 

export const productsAPI = {
  
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

  getRelatedBySlug: async (slug: string, limit = 10): Promise<ApiResponse<ProductDTO[]>> => {
    try {
      const res = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.RELATED_BY_SLUG(slug)}?limit=${limit}`
      )
      const data = await res.json()
      return data
    } catch (err: any) {
      console.error(`Error fetching related products by slug ${slug}:`, err)
      return {
        code: 1,
        message: err.message ?? "Failed to fetch related products",
        data: []
      }
    }
  },

  getProductsByIds: async (
    ids: string[],
    limit: number
  ): Promise<ApiResponse<ProductDTO[]>> => {
    try {
      const query = new URLSearchParams()
      ids.forEach(id => query.append('ids', id))
      query.append('limit', String(limit))

      const res = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.LIST_BY_IDS}?${query.toString()}`
      )

      return await res.json()
    } catch (err: any) {
      console.error('Error fetching products by ids:', err)
      return {
        code: 1,
        message: err.message ?? 'Failed to fetch by ids products',
        data: []
      }
    }
  },

  getWishlistByUserId: async (userId: string): Promise<ApiResponse<WishlistItem[]>> => {
    try {
      const res = await fetchWithAuth(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.LIST_BY_USER_WISHLIST(userId)}`
      )
      return await res.json()
    } catch (err: any) {
      console.error(`Error fetching wishlist for user ${userId}:`, err)
      return {
        code: 1,
        message: err.message ?? "Failed to fetch wishlist",
        data: []
      }
    }
  },

  getMostOrdered: async (
    categoryId: string,
    page: number,
    limit: number,
    sort?: ProductSortType
  ) => {
    try {
      const url = new URL(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.LIST_MOST_ORDER}`
      )
      url.searchParams.set('page', String(page))
      url.searchParams.set('limit', String(limit))
      if (sort) url.searchParams.set('sort', sort)
      if (categoryId) url.searchParams.set('categoryId', categoryId)
      
      const res = await fetch(url.toString())
      const result = await res.json()

      if (result.code !== 0) {
        throw new Error(result.message || "Lỗi khi lấy sản phẩm theo danh mục")
      }

      return {
        code: 0,
        data: result.data,
        pagination: result.pagination,
      }
    } catch (err) {
      console.error("Error fetching products by category:", err)
      throw err
    }
  },

  getPromotional: async (
    categoryId: string,
    page: number,
    limit: number,
    sort?: ProductSortType
  ) => {
    try {
      const url = new URL(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.LIST_PROMOTION}`
      )
      url.searchParams.set('page', String(page))
      url.searchParams.set('limit', String(limit))
      if (sort) url.searchParams.set('sort', sort)
      if (categoryId) url.searchParams.set('categoryId', categoryId)
      
      const res = await fetch(url.toString())
      const result = await res.json()

      if (result.code !== 0) {
        throw new Error(result.message || "Lỗi khi lấy sản phẩm theo danh mục")
      }

      return {
        code: 0,
        data: result.data,
        pagination: result.pagination,
      }
    } catch (err) {
      console.error("Error fetching products by category:", err)
      throw err
    }
  },

  getListByCategory: async (
    id: string,
    page: number,
    limit: number,
    sort?: ProductSortType
  ) => {
    try {
      const url = new URL(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.LIST_BY_CATEGORY(id)}`
      )
      url.searchParams.set("page", String(page))
      url.searchParams.set("limit", String(limit))
      if (sort) {
        url.searchParams.set("sort", sort)
      }
      
      const res = await fetch(url.toString())
      const result = await res.json()

      if (result.code !== 0) {
        throw new Error(result.message || "Lỗi khi lấy sản phẩm theo danh mục")
      }

      return {
        code: 0,
        data: result.data,
        pagination: result.pagination,
      }
    } catch (err) {
      console.error("Error fetching products by category:", err)
      throw err
    }
  },

  search: async (keyword: string, page = 1, limit = 20): Promise<ProductPaginationDTO> => {
    try {
      const url = `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.SEARCH}?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`
      const res = await fetch(url)
      const data = await res.json()
      return data
    } catch (err: any) {
      console.error("Error searching products:", err)
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

  addToWishlist: async (userId: string, productId: string): Promise<ApiResponse<WishlistItem>> => {
    try {
      const res = await fetchWithAuth(
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

  removeFromWishlist: async (userId: string, productId: string): Promise<ApiResponse<null>> => {
    try {
      const res = await fetchWithAuth(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.DELETE_WISHLIST(userId, productId)}`,
        {
          method: 'DELETE',
        }
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
 
  getCartProducts: async (ids: string[]): Promise<ApiResponse<ProductDTO[]>> => {
    try {
      const res = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.CART_DETAIL}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ ids }),
        }
      )
      const data = await res.json()
      return data
    } catch (err: any) {
      console.error("Error fetching cart products:", err)
      return {
        code: 1,
        message: err.message ?? "Failed to fetch cart products",
        data: []
      }
    }
  },

  checkProductStock: async (
    payload: {
      productId: string
      combinationId?: string
      quantity: number
    }
  ): Promise<any> => {
    try {
      const response = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.CHECK_STOCK}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(payload)
        }
      )

      const data = await response.json()
      return data
    } catch (err: any) {
      console.error('Error checking product stock:', err)
      return {
        code: 1,
        message: err.message ?? 'Failed to check product stock',
        data: null as any
      }
    }
  }

}
