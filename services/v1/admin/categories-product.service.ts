import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin'
import type { CategoryProductDTO, CreateCategoryProductDTO, UpdateCategoryProductDTO } from '@/server/types/dto/v1/product.dto'
import { Types } from "mongoose";
import type { ApiResponse } from '@server/types/common/api-response'

export const categoriesAPI = {
  getAll: async () => {
  try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES.LIST}`, {
        credentials: 'include',
      })
      const data = await response.json()
      return data;
    } catch (err) {
      console.error('Error:', err)
    }
  },
  getAllTree: async () => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES.LIST_TREE}`, {
        credentials: 'include',
      });
      const data = await response.json();
      return data;
    } catch (err) {
      console.error('Error:', err);
    }
  },
  // getChildren: async (parentId: string, includeInactive = false) => {
  //   try {
  //     const url = new URL(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES.GET_CHILDREN(parentId)}`)
  //     url.searchParams.set("includeInactive", String(includeInactive))

  //     const response = await fetch(url.toString())
  //     return await response.json()
  //   } catch (err) {
  //     console.error(err)
  //     throw err
  //   }
  // },
  create: async (bodyData: CreateCategoryProductDTO) => {
    try {
      if (!bodyData.categoryName || !bodyData.image) {
        throw new Error('Missing required fields: categoryName, image')
      }

      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES.CREATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(bodyData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error('Error creating category:', err)
      throw err
    }
  },
  getDetail: async (id: string) => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES.GET_BY_ID(id)}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch category with ID ${id}`)
      }
      const data = await response.json()
      return data
    } catch (err) {
      console.error(`Error getting category detail with ID ${id}:`, err)
      throw err
    }
  },
  // getDetailBySlug: async (slug: string) => {
  //   try {
  //     const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES.GET_BY_SLUG(slug)}`)
  //     if (!response.ok) {
  //       throw new Error(`Failed to fetch category with slug ${slug}`)
  //     }
  //     const data = await response.json()
  //     return data
  //   } catch (err) {
  //     console.error(`Error getting category detail with slug ${slug}:`, err)
  //     throw err
  //   }
  // },
  update: async (id: string, bodyData: UpdateCategoryProductDTO) => {
    try {

      const payload = {
        ...bodyData,
        _id: bodyData.id,
      };

      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES.UPDATE(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (err) {
      console.error(`Error updating category with ID ${id}:`, err)
      throw err
    }
  },
  delete: async (id:string) => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES.DELETE(id)}`, {
        method: 'DELETE',
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (err) {
      console.error(`Error deleting category with ID ${id}:`, err)
      throw err
    }
  },
  // getListByCategory: async (
  //   id: string,
  //   page: number,
  //   limit: number,
  //   sort?: "discount" | "popular" | "price_desc" | "price_asc"
  // ) => {
  //   try {
  //     const url = new URL(
  //       `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCTS.LIST_BY_CATEGORY(id)}`
  //     )
  //     url.searchParams.set("page", String(page))
  //     url.searchParams.set("limit", String(limit))
  //     if (sort) {
  //       url.searchParams.set("sort", sort)
  //     }
      
  //     const res = await fetch(url.toString())
  //     const result = await res.json()

  //     if (result.code !== 0) {
  //       throw new Error(result.message || "Lỗi khi lấy sản phẩm theo danh mục")
  //     }

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
  updateOrder: async (id: string, newOrder: number): Promise<ApiResponse<CategoryProductDTO>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES.UPDATE_ORDER(id)}`, {
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

      const data: ApiResponse<CategoryProductDTO> = await response.json()
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
  toggleActive: async (id: string): Promise<ApiResponse<CategoryProductDTO>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.CATEGORIES.TOGGLE_ACTIVE(id)}`, {
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

      const data: ApiResponse<CategoryProductDTO> = await response.json()
      return data
    } catch (err) {
      console.error(`Error toggling active status for category product ID ${id}:`, err)
      return {
        code: 1,
        message: 'Unexpected error while toggling active status',
        data: undefined as any
      }
    }
  },
}