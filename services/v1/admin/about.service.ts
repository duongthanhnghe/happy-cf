import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin'
import type { CreateAboutBody, UpdateAboutBody, AboutDTO } from '@/server/types/dto/v1/about.dto'
import type { ApiResponse } from '@server/types/common/api-response'

export const aboutAPI = {
  getAll: async (): Promise<ApiResponse<AboutDTO[]>> => {
  try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ABOUT.LIST}`)
      const data = await response.json()
      return data;
    } catch (err) {
      console.error('Error:', err)
      return {
        code: 1,
        message: 'Failed to fetch Abouts',
        data: []
      }
    }
  },
  create: async (bodyData:CreateAboutBody): Promise<ApiResponse<AboutDTO>> => {
    try {
      if (!bodyData.title || !bodyData.image) {
        return {
          code: 1,
          message: 'Missing required fields: title, image',
          data: undefined as any
        }
      }

      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ABOUT.CREATE}`, {
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

      const data:ApiResponse<AboutDTO> = await response.json()
      return data
    } catch (err) {
      console.error('Error creating category:', err)
      return {
        code: 1,
        message: 'Unexpected error while creating About',
        data: undefined as any
      }
    }
  },
  getDetail: async (id:string): Promise<ApiResponse<AboutDTO>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ABOUT.GET_BY_ID(id)}`)
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
  update: async (id:string, bodyData:UpdateAboutBody): Promise<ApiResponse<AboutDTO>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ABOUT.UPDATE(id)}`, {
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
      
      const data:ApiResponse<AboutDTO> = await response.json()
      return data
    } catch (err) {
      console.error(`Error updating About with ID ${id}:`, err)
      return {
        code: 1,
        message: `Error updating About with ID ${id}:`,
        data: undefined as any
      }
    }
  },
  delete: async (id: string) => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ABOUT.DELETE(id)}`, {
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
  updateOrder: async (id: string, newOrder: number): Promise<ApiResponse<AboutDTO>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ABOUT.UPDATE_ORDER(id)}`, {
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

      const data: ApiResponse<AboutDTO> = await response.json()
      return data
    } catch (err) {
      console.error(`Error updating order for About ID ${id}:`, err)
      return {
        code: 1,
        message: 'Unexpected error while updating order',
        data: undefined as any
      }
    }
  },
  toggleActive: async (id: string): Promise<ApiResponse<AboutDTO>> => {
    try {
      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ABOUT.TOGGLE_ACTIVE(id)}`, {
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

      const data: ApiResponse<AboutDTO> = await response.json()
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