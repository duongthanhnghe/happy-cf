import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS } from '@/services/const/api.const'
import type { AddressDTO, CreateAddressBody } from '@/server/types/dto/v1/address.dto'

export const addressesAPI = {
  getAll: async (userId: string) => {
    try {
      const response = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.ADDRESSES.LIST}/${userId}`, {
          credentials: 'include',
        }
      )
      const data = await response.json()
      return data
    } catch (err) {
      console.error("Error:", err)
      throw err
    }
  },
  create: async (bodyData: CreateAddressBody) => {
    try {
      if (!bodyData.userId || !bodyData.fullname || !bodyData.fullname || !bodyData.phone || !bodyData.address || !bodyData.tag) {
        throw new Error('Missing required fields: categoryName, id, image')
      }

      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.ADDRESSES.CREATE}`, {
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
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.ADDRESSES.GET_BY_ID(id)}`,{
        credentials: 'include',
      })
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
  update: async (id: string, bodyData: CreateAddressBody) => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.ADDRESSES.UPDATE(id)}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(bodyData)
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
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.ADDRESSES.DELETE(id)}`, {
        method: 'DELETE',
        credentials: 'include',
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
  setAddressDefault: async (id: string) => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.ADDRESSES.SET_DEFAULT(id)}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      console.log(`Address with ID ${id} set as default successfully`)

      return await response.json()
    } catch (err) {
      console.error(`Error updating category with ID ${id}:`, err)
      throw err
    }
  },
  getDefaultAddressByUserId: async (userId: string) => {
    try {
      const res = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.ADDRESSES.GET_BY_ID_DEFAULT(userId)}`,{
        credentials: 'include',
      })

      if (!res.ok) {
        throw new Error('Không thể lấy địa chỉ mặc định')
      }

      const json = await res.json()

      if (json.code === 0) {
        return json.data as AddressDTO
      } else {
        console.warn(json.message)
        return null
      }
    } catch (error) {
      console.error('Lỗi khi lấy địa chỉ mặc định:', error)
      return null
    }
  },
}