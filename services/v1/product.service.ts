import { API_ENDPOINTS } from '@/services/const/api.const'
import type { 
  ProductDTO, 
  WishlistItem, 
  ProductSortType,
  CheckStockResult
} from '@/server/types/dto/v1/product.dto'
import type { ApiResponse } from '@/server/types/common/api-response'
import { apiClient } from '@/services/http/apiClient'
import { paginationError, type PaginationDTO } from '@/server/types/common/pagination.dto'
import { apiError } from "@/server/types/common/api-response"

export const productsAPI = {

  getDetail: async (id: string): Promise<ApiResponse<ProductDTO>> => {
    try {
      return await apiClient().get<ApiResponse<ProductDTO>>(
        API_ENDPOINTS.PRODUCTS.GET_BY_ID(id)
      );
    } catch (err: any) {
      console.error(`Error getting product detail with ID ${id}:`, err);
      return apiError<ProductDTO>(err)
    }
  },

  getRelatedBySlug: async (slug: string, limit = 10): Promise<ApiResponse<ProductDTO[]>> => {
    try {
      return await apiClient().get<ApiResponse<ProductDTO[]>>(
        API_ENDPOINTS.PRODUCTS.RELATED_BY_SLUG(slug),
        { limit }
      );
    } catch (err: any) {
      console.error(`Error fetching related products by slug ${slug}:`, err);
      return apiError<ProductDTO[]>(err)
    }
  },

  getProductsByIds: async (
    ids: string[],
    limit: number
  ): Promise<ApiResponse<ProductDTO[]>> => {
    try {
      const query = new URLSearchParams();
      ids.forEach(id => query.append('ids', id));
      query.append('limit', String(limit));

      return await apiClient().get<ApiResponse<ProductDTO[]>>(
        `${API_ENDPOINTS.PRODUCTS.LIST_BY_IDS}?${query.toString()}`
      );
    } catch (err: any) {
      console.error('Error fetching products by ids:', err);
      return apiError<ProductDTO[]>(err)
    }
  },

  getWishlistByUserId: async (userId: string): Promise<ApiResponse<WishlistItem[]>> => {
    try {
      return await apiClient().authGet<ApiResponse<WishlistItem[]>>(
        API_ENDPOINTS.PRODUCTS.LIST_BY_USER_WISHLIST(userId)
      );
    } catch (err: any) {
      console.error(`Error fetching wishlist for user ${userId}:`, err);
      return apiError<WishlistItem[]>(err)
    }
  },

  getMostOrdered: async (
    categoryId: string,
    page: number,
    limit: number,
    sort?: ProductSortType
  ): Promise<PaginationDTO<ProductDTO>> => {
    try {
      return await apiClient().get<PaginationDTO<ProductDTO>>(
        API_ENDPOINTS.PRODUCTS.LIST_MOST_ORDER,
        {
          page,
          limit,
          ...(sort && { sort }),
          ...(categoryId && { categoryId }),
        }
      )
    } catch (err: any) {
      console.error('[getMostOrdered]', err)
      return paginationError<ProductDTO>(page, limit, err)
    }
  },

  getPromotional: async (
    categoryId: string,
    page: number,
    limit: number,
    sort?: ProductSortType
  ): Promise<PaginationDTO<ProductDTO>> => {
    try {
    return await apiClient().get<PaginationDTO<ProductDTO>>(
      API_ENDPOINTS.PRODUCTS.LIST_PROMOTION,
      {
        page,
        limit,
        ...(sort && { sort }),
        ...(categoryId && { categoryId }),
      }
    )

    } catch (err: any) {
      console.error('[getPromotional]', err)
      return paginationError<ProductDTO>(page, limit, err)
    }
  },

  getListByCategory: async (
    id: string,
    page: number,
    limit: number,
    sort?: ProductSortType
  ): Promise<PaginationDTO<ProductDTO>> => {
    try {
      return await apiClient().get<PaginationDTO<ProductDTO>>(
        API_ENDPOINTS.PRODUCTS.LIST_BY_CATEGORY(id),
        {
          page,
          limit,
          ...(sort && { sort }),
        }
      )

    } catch (err: any) {
      console.error('[getListByCategory]', err)
      return paginationError<ProductDTO>(page, limit, err)
    }
  },

  search: async (
    keyword: string,
    page = 1,
    limit = 20
  ): Promise<PaginationDTO<ProductDTO>> => {
    try {
      return await apiClient().get<PaginationDTO<ProductDTO>>(
        API_ENDPOINTS.PRODUCTS.SEARCH,
        {
          keyword,
          page,
          limit,
        }
      )

    } catch (err: any) {
      console.error("Error searching products:", err)
      return paginationError<ProductDTO>(page, limit, err)
    }
  },

  addToWishlist: async (
    userId: string,
    productId: string
  ): Promise<ApiResponse<WishlistItem>> => {
    try {
      return apiClient().authPost<ApiResponse<WishlistItem>>(
        API_ENDPOINTS.PRODUCTS.ADD_WISHLIST(userId),
        {
          productId
        }
      )
    } catch (err: any) {
      console.error(`add to wishlist failed:`, err)
      return apiError<WishlistItem>(err)
    }
  },

  removeFromWishlist: async (
    userId: string,
    productId: string
  ): Promise<ApiResponse<null>> => {
    try {
      return apiClient().authDelete<ApiResponse<null>>(
        API_ENDPOINTS.PRODUCTS.DELETE_WISHLIST(userId, productId)
      )
    } catch (err: any) {
      console.error(`Remove wishlist failed:`, err)
      return apiError<null>(err)
    }
  },

  getCartProducts: async (
    ids: string[]
  ): Promise<ApiResponse<ProductDTO[]>> => {
    try {
      return apiClient().post<ApiResponse<ProductDTO[]>>(
        API_ENDPOINTS.PRODUCTS.CART_DETAIL,
        { ids }
      )
    } catch (err: any) {
      console.error("Error fetching cart products:", err)
      return apiError<ProductDTO[]>(err)
    }
  },

  checkProductStock: async (
    payload: {
      productId: string
      combinationId?: string
      quantity: number
    }
  ): Promise<ApiResponse<CheckStockResult>> => {
    try {
      return apiClient().post<ApiResponse<CheckStockResult>>(
        API_ENDPOINTS.PRODUCTS.CHECK_STOCK,
        payload
      )
    } catch (err: any) {
      console.error('Error checking product stock:', err)
      return apiError<CheckStockResult>(err)
    }
  },

  getTopFlashSaleProducts: async (): Promise<ApiResponse<ProductDTO[]>> => {
    try {
      return await apiClient().get<ApiResponse<ProductDTO[]>>(
        API_ENDPOINTS.PRODUCTS.FLASH_SALE_TOP_PRODUCTS
      )
    } catch (err: any) {
      console.error('[getTopFlashSaleProducts]', err)
      return apiError<ProductDTO[]>(err)
    }
  },

  getProductsByFlashSale: async (
    flashSaleId: string,
    page: number,
    limit: number
  ): Promise<PaginationDTO<ProductDTO>> => {
    try {
      return await apiClient().get<PaginationDTO<ProductDTO>>(
        API_ENDPOINTS.PRODUCTS.FLASH_SALE_PRODUCTS(flashSaleId),
        {
          page,
          limit,
        }
      )
    } catch (err: any) {
      console.error('[getProductsByFlashSale]', err)
      return paginationError<ProductDTO>(page, limit, err)
    }
  },

}
