import { API_ENDPOINTS } from '@/services/const/api.const'
import type { 
  ProductDTO, 
  WishlistItem, 
  ProductSortType
} from '@/server/types/dto/v1/product.dto'
import type { ApiResponse } from '@/server/types/common/api-response'
import { apiClient } from '@/services/http/apiClient'
import type { PaginationDTO } from '@/server/types/common/pagination.dto'

export const productsAPI = {
  
  // getDetail: async (id: string): Promise<ApiResponse<ProductDTO>> => {
  //   try {
  //     const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.GET_BY_ID(id)}`)
  //     const data = await response.json()
  //     return data
  //   } catch (err: any) {
  //     console.error(`Error getting product detail with ID ${id}:`, err)
  //     return {
  //       code: 1,
  //       message: err.message ?? "Failed to fetch product detail",
  //       data: null as any
  //     }
  //   }
  // },

  getDetail: async (id: string): Promise<ApiResponse<ProductDTO>> => {
    try {
      return await apiClient().get<ApiResponse<ProductDTO>>(
        API_ENDPOINTS.PRODUCTS.GET_BY_ID(id)
      );
    } catch (err: any) {
      console.error(`Error getting product detail with ID ${id}:`, err);
      return {
        code: 1,
        message: err.message ?? "Failed to fetch product detail",
        data: null as any,
      };
    }
  },

  // getRelatedBySlug: async (slug: string, limit = 10): Promise<ApiResponse<ProductDTO[]>> => {
  //   try {
  //     const res = await fetch(
  //       `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.RELATED_BY_SLUG(slug)}?limit=${limit}`
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

  getRelatedBySlug: async (slug: string, limit = 10): Promise<ApiResponse<ProductDTO[]>> => {
    try {
      return await apiClient().get<ApiResponse<ProductDTO[]>>(
        API_ENDPOINTS.PRODUCTS.RELATED_BY_SLUG(slug),
        { limit }
      );
    } catch (err: any) {
      console.error(`Error fetching related products by slug ${slug}:`, err);
      return {
        code: 1,
        message: err.message ?? "Failed to fetch related products",
        data: [],
      };
    }
  },

  // getProductsByIds: async (
  //   ids: string[],
  //   limit: number
  // ): Promise<ApiResponse<ProductDTO[]>> => {
  //   try {
  //     const query = new URLSearchParams()
  //     ids.forEach(id => query.append('ids', id))
  //     query.append('limit', String(limit))

  //     const res = await fetch(
  //       `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.LIST_BY_IDS}?${query.toString()}`
  //     )

  //     return await res.json()
  //   } catch (err: any) {
  //     console.error('Error fetching products by ids:', err)
  //     return {
  //       code: 1,
  //       message: err.message ?? 'Failed to fetch by ids products',
  //       data: []
  //     }
  //   }
  // },
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
      return {
        code: 1,
        message: err.message ?? 'Failed to fetch by ids products',
        data: [],
      };
    }
  },

  // getWishlistByUserId: async (userId: string): Promise<ApiResponse<WishlistItem[]>> => {
  //   try {
  //     const res = await fetchWithAuth(
  //       `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.LIST_BY_USER_WISHLIST(userId)}`
  //     )
  //     return await res.json()
  //   } catch (err: any) {
  //     console.error(`Error fetching wishlist for user ${userId}:`, err)
  //     return {
  //       code: 1,
  //       message: err.message ?? "Failed to fetch wishlist",
  //       data: []
  //     }
  //   }
  // },

  getWishlistByUserId: async (userId: string): Promise<ApiResponse<WishlistItem[]>> => {
    try {
      return await apiClient().authGet<ApiResponse<WishlistItem[]>>(
        API_ENDPOINTS.PRODUCTS.LIST_BY_USER_WISHLIST(userId)
      );
    } catch (err: any) {
      console.error(`Error fetching wishlist for user ${userId}:`, err);
      return {
        code: 1,
        message: err.message ?? "Failed to fetch wishlist",
        data: [],
      };
    }
  },

  getMostOrdered: async (
    categoryId: string,
    page: number,
    limit: number,
    sort?: ProductSortType
  ): Promise<PaginationDTO<ProductDTO>> => {
    try {
      const result = await apiClient().get<PaginationDTO<ProductDTO>>(
        API_ENDPOINTS.PRODUCTS.LIST_MOST_ORDER,
        {
          page,
          limit,
          ...(sort && { sort }),
          ...(categoryId && { categoryId }),
        }
      )

      if (result.code !== 0) {
        throw new Error(result.message || 'Lỗi khi lấy sản phẩm theo danh mục')
      }

      return result
    } catch (err: any) {
      console.error('[getMostOrdered]', err)
      return {
        code: 1,
        message: err.message ?? "Failed to fetch related products",
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      };
    }
  },

  getPromotional: async (
    categoryId: string,
    page: number,
    limit: number,
    sort?: ProductSortType
  ): Promise<PaginationDTO<ProductDTO>> => {
    try {
    const result = await apiClient().get<PaginationDTO<ProductDTO>>(
      API_ENDPOINTS.PRODUCTS.LIST_PROMOTION,
      {
        page,
        limit,
        ...(sort && { sort }),
        ...(categoryId && { categoryId }),
      }
    )

    if (result.code !== 0) {
      throw new Error(result.message || 'Lỗi khi lấy sản phẩm khuyến mãi')
    }

    return result
    } catch (err: any) {
      console.error('[getPromotional]', err)
      return {
        code: 1,
        message: err.message ?? "Failed to fetch products",
        data: [],
        pagination: {
          page,
          limit,
          total: 0,
          totalPages: 0
        }
      };
    }
  },


//   getPromotional: async (
//     categoryId: string,
//     page: number,
//     limit: number,
//     sort?: ProductSortType
//   ) => {
//     try {
//       const params = new URLSearchParams({
//         page: String(page),
//         limit: String(limit),
//       })

//       if (sort) params.set('sort', sort)
//       if (categoryId) params.set('categoryId', categoryId)

//       const res = await fetch(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.LIST_PROMOTION}?${params.toString()}`
//       )
      
//       const result = await res.json()

//       if (result.code !== 0) {
//         throw new Error(result.message || "Lỗi khi lấy sản phẩm theo danh mục")
//       }

//       return {
//         code: 0,
//         data: result.data,
//         pagination: result.pagination,
//       }
//     } catch (err) {
//       console.error("Error fetching products by category:", err)
//       throw err
//     }
//   },

// getListByCategory: async (
//   id: string,
//   page: number,
//   limit: number,
//   sort?: ProductSortType
// ): Promise<ProductPaginationDTO> => {

//   const params = new URLSearchParams({
//     page: String(page),
//     limit: String(limit),
//   })

//   if (sort) params.set('sort', sort)

//   try {
//     const url = `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.LIST_BY_CATEGORY(id)}?${params.toString()}`

//     const res = await fetch(url)
//     const result = await res.json()

//     if (result.code !== 0) {
//       throw new Error(result.message || "Lỗi khi lấy sản phẩm theo danh mục")
//     }

getListByCategory: async (
  id: string,
  page: number,
  limit: number,
  sort?: ProductSortType
): Promise<PaginationDTO<ProductDTO>> => {
  try {
    const result = await apiClient().get<PaginationDTO<ProductDTO>>(
      API_ENDPOINTS.PRODUCTS.LIST_BY_CATEGORY(id),
      {
        page,
        limit,
        ...(sort && { sort }),
      }
    )

    if (result.code !== 0) {
      throw new Error(result.message || 'Lỗi khi lấy sản phẩm theo danh mục')
    }

    return result
  } catch (err: any) {
    console.error('[getListByCategory]', err)
    return {
      code: 1,
      message: err.message ?? "Failed to fetch products",
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0
      }
    };
  }
},


//     return {
//       code: 0,
//       data: result.data,
//       pagination: result.pagination,
//     }
//   } catch (err) {
//     console.error("Error fetching products by category:", err)
//     throw err
//   }
// },


//   search: async (keyword: string, page = 1, limit = 20): Promise<ProductPaginationDTO> => {
//     try {
//       const url = `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.SEARCH}?keyword=${encodeURIComponent(keyword)}&page=${page}&limit=${limit}`
//       const res = await fetch(url)
//       const data = await res.json()
//       return data
//     } catch (err: any) {
//       console.error("Error searching products:", err)
//       return {
//         code: 1,
//         message: err.message ?? "Failed to fetch posts",
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

search: async (
  keyword: string,
  page = 1,
  limit = 20
): Promise<PaginationDTO<ProductDTO>> => {
  try {
    const result = await apiClient().get<PaginationDTO<ProductDTO>>(
      API_ENDPOINTS.PRODUCTS.SEARCH,
      {
        keyword,
        page,
        limit,
      }
    )

    if (result.code !== 0) {
      throw new Error(result.message || 'Lỗi khi tìm kiếm sản phẩm')
    }

    return result
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
    return {
      code: 1,
      message: err.message ?? "Failed to add to wishlist",
      data: null as any
    }
  }
},


//   removeFromWishlist: async (userId: string, productId: string): Promise<ApiResponse<null>> => {
//     try {
//       const res = await fetchWithAuth(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.DELETE_WISHLIST(userId, productId)}`,
//         {
//           method: 'DELETE',
//         }
//       )
//       const data = await res.json()
//       return data
//     } catch (err: any) {
//       console.error(`Remove wishlist failed:`, err)
//       return {
//         code: 1,
//         message: err.message ?? "Failed to remove from wishlist",
//         data: null as any
//       }
//     }
//   },

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
    return {
      code: 1,
      message: err.message ?? "Failed to remove from wishlist",
      data: null as any
    }
  }
},

 
//   getCartProducts: async (ids: string[]): Promise<ApiResponse<ProductDTO[]>> => {
//     try {
//       const res = await fetch(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.CART_DETAIL}`,
//         {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ ids }),
//         }
//       )
//       const data = await res.json()
//       return data
//     } catch (err: any) {
//       console.error("Error fetching cart products:", err)
//       return {
//         code: 1,
//         message: err.message ?? "Failed to fetch cart products",
//         data: []
//       }
//     }
//   },

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
    return {
      code: 1,
      message: err.message ?? "Failed to fetch cart products",
      data: []
    }
  }
},


//   checkProductStock: async (
//     payload: {
//       productId: string
//       combinationId?: string
//       quantity: number
//     }
//   ): Promise<any> => {
//     try {
//       const response = await fetch(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCTS.CHECK_STOCK}`,
//         {
//           method: 'POST',
//           headers: {
//             'Content-Type': 'application/json'
//           },
//           body: JSON.stringify(payload)
//         }
//       )

//       const data = await response.json()
//       return data
//     } catch (err: any) {
//       console.error('Error checking product stock:', err)
//       return {
//         code: 1,
//         message: err.message ?? 'Failed to check product stock',
//         data: null as any
//       }
//     }
//   }

checkProductStock: async (
  payload: {
    productId: string
    combinationId?: string
    quantity: number
  }
): Promise<ApiResponse<any>> => {
  try {
    return apiClient().post<ApiResponse<any>>(
      API_ENDPOINTS.PRODUCTS.CHECK_STOCK,
      payload
    )
  } catch (err: any) {
    console.error('Error checking product stock:', err)
    return {
      code: 1,
      message: err.message ?? 'Failed to check product stock',
      data: null as any
    }
  }
},

}
