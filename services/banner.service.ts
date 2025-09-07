import { apiConfig } from '@/config/api.config'
import { API_ENDPOINTS } from '@/const/api.const'
import type { CreateBannerBody, UpdateBannerBody, BannerDTO } from '@server/types/dto/banner.dto'
import type { ApiResponse } from '@server/types/common/api-response'

export const bannersAPI = {
  getAll: async (): Promise<ApiResponse<BannerDTO[]>> => {
  try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.BANNERS.LIST}`)
      const data = await response.json()
      return data;
    } catch (err) {
      console.error('Error:', err)
      return {
        code: 1,
        message: 'Failed to fetch banners',
        data: []
      }
    }
  },
  create: async (bodyData:CreateBannerBody): Promise<ApiResponse<BannerDTO>> => {
    try {
      if (!bodyData.title || !bodyData.image) {
        return {
          code: 1,
          message: 'Missing required fields: title, image',
          data: undefined as any
        }
      }

      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.BANNERS.CREATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          code: 1,
          message: errorData,
          data: undefined as any
        }
      }

      const data:ApiResponse<BannerDTO> = await response.json()
      return data
    } catch (err) {
      console.error('Error creating category:', err)
      return {
        code: 1,
        message: 'Unexpected error while creating banner',
        data: undefined as any
      }
    }
  },
  getDetail: async (id:string): Promise<ApiResponse<BannerDTO>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.BANNERS.GET_BY_ID(id)}`)
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
  update: async (id:string, bodyData:UpdateBannerBody): Promise<ApiResponse<BannerDTO>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.BANNERS.UPDATE(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData)
      })
    
      if (!response.ok) {
        const errorData = await response.json()
        return {
          code: 1,
          message: errorData,
          data: undefined as any
        }
      }
      
      const data:ApiResponse<BannerDTO> = await response.json()
      return data
    } catch (err) {
      console.error(`Error updating banner with ID ${id}:`, err)
      return {
        code: 1,
        message: `Error updating banner with ID ${id}:`,
        data: undefined as any
      }
    }
  },
  delete: async (id: string) => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.BANNERS.DELETE(id)}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (err) {
      console.error(`Error deleting category with ID ${id}:`, err)
      throw err
    }
  },
  updateOrder: async (id: string, newOrder: number): Promise<ApiResponse<BannerDTO>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.BANNERS.UPDATE_ORDER(id)}`, {
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

      const data: ApiResponse<BannerDTO> = await response.json()
      return data
    } catch (err) {
      console.error(`Error updating order for banner ID ${id}:`, err)
      return {
        code: 1,
        message: 'Unexpected error while updating order',
        data: undefined as any
      }
    }
  },
  toggleActive: async (id: string): Promise<ApiResponse<BannerDTO>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.BANNERS.TOGGLE_ACTIVE(id)}`, {
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

      const data: ApiResponse<BannerDTO> = await response.json()
      return data
    } catch (err) {
      console.error(`Error toggling active status for banner ID ${id}:`, err)
      return {
        code: 1,
        message: 'Unexpected error while toggling active status',
        data: undefined as any
      }
    }
  },
}