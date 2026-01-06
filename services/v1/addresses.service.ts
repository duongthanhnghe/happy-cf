import { apiClient } from '@/services/http/apiClient'
import { API_ENDPOINTS } from '@/services/const/api.const'
import type {
  AddressDTO,
  CreateAddressBody
} from '@/server/types/dto/v1/address.dto'
import type { ApiResponse } from '@/server/types/common/api-response'

export const addressesAPI = {
  getAll: async (): Promise<ApiResponse<AddressDTO[]>> => {
    try {
      return await apiClient().authGet<ApiResponse<AddressDTO[]>>(
        API_ENDPOINTS.ADDRESSES.LIST
      )
    } catch (err: any) {
      console.error('[addressesAPI.getAll]', err)
      return {
        code: 1,
        message: err.message ?? 'Failed to fetch addresses',
        data: [],
      }
    }
  },

  create: async (
    bodyData: CreateAddressBody
  ): Promise<ApiResponse<AddressDTO>> => {
    try {
      return await apiClient().authPost<ApiResponse<AddressDTO>>(
        API_ENDPOINTS.ADDRESSES.CREATE,
        bodyData
      )
    } catch (err: any) {
      console.error('[addressesAPI.create]', err)
      throw err
    }
  },

  getDetail: async (id: string): Promise<ApiResponse<AddressDTO>> => {
    try {
      return await apiClient().authGet<ApiResponse<AddressDTO>>(
        API_ENDPOINTS.ADDRESSES.GET_BY_ID(id)
      )
    } catch (err: any) {
      console.error(`[addressesAPI.getDetail] id=${id}`, err)
      throw err
    }
  },

  update: async (
    id: string,
    bodyData: CreateAddressBody
  ): Promise<ApiResponse<AddressDTO>> => {
    try {
      return await apiClient().authPut<ApiResponse<AddressDTO>>(
        API_ENDPOINTS.ADDRESSES.UPDATE(id),
        bodyData
      )
    } catch (err: any) {
      console.error(`[addressesAPI.update] id=${id}`, err)
      throw err
    }
  },

  delete: async (id: string): Promise<ApiResponse<any>> => {
    try {
      return await apiClient().authDelete<ApiResponse<any>>(
        API_ENDPOINTS.ADDRESSES.DELETE(id)
      )
    } catch (err: any) {
      console.error(`[addressesAPI.delete] id=${id}`, err)
      throw err
    }
  },

  setAddressDefault: async (id: string): Promise<ApiResponse<AddressDTO>> => {
    try {
      return await apiClient().authPost<ApiResponse<AddressDTO>>(
        API_ENDPOINTS.ADDRESSES.SET_DEFAULT(id)
      )
    } catch (err: any) {
      console.error(`[addressesAPI.setAddressDefault] id=${id}`, err)
      throw err
    }
  },

  getDefaultAddressByUserId: async (): Promise<AddressDTO | null> => {
    try {
      const res = await apiClient().authGet<ApiResponse<AddressDTO>>(
        API_ENDPOINTS.ADDRESSES.GET_BY_ID_DEFAULT
      )

      if (res.code === 0) {
        return res.data
      }

      console.warn('[addressesAPI.getDefaultAddressByUserId]', res.message)
      return null
    } catch (err: any) {
      console.error('[addressesAPI.getDefaultAddressByUserId]', err)
      return null
    }
  },
}

// import { API_ENDPOINTS } from '@/services/const/api.const'
// import type { AddressDTO, CreateAddressBody } from '@/server/types/dto/v1/address.dto'

// export const addressesAPI = {
//   getAll: async () => {
//     try {
//       const response = await fetchWithAuth(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS.ADDRESSES.LIST}`
//       )
//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error("Error:", err)
//       throw err
//     }
//   },
//   create: async (bodyData: CreateAddressBody) => {
//     try {
//       const response = await fetchWithAuth(`${apiConfig.baseApiURL}${API_ENDPOINTS.ADDRESSES.CREATE}`, {
//         method: 'POST',
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(bodyData)
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
//       }

//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error('Error creating category:', err)
//       throw err
//     }
//   },
//   getDetail: async (id: string) => {
//     try {
//       const response = await fetchWithAuth(`${apiConfig.baseApiURL}${API_ENDPOINTS.ADDRESSES.GET_BY_ID(id)}`)
//       if (!response.ok) {
//         throw new Error(`Failed to fetch category with ID ${id}`)
//       }
//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error(`Error getting category detail with ID ${id}:`, err)
//       throw err
//     }
//   },
//   update: async (id: string, bodyData: CreateAddressBody) => {
//     try {
//       const response = await fetchWithAuth(`${apiConfig.baseApiURL}${API_ENDPOINTS.ADDRESSES.UPDATE(id)}`, {
//         method: 'PUT',
//         headers: {
//           "Content-Type": "application/json"
//         },
//         body: JSON.stringify(bodyData)
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
//       }

//       return await response.json()
//     } catch (err) {
//       console.error(`Error updating category with ID ${id}:`, err)
//       throw err
//     }
//   },
//   delete: async (id:string) => {
//     try {
//       const response = await fetchWithAuth(`${apiConfig.baseApiURL}${API_ENDPOINTS.ADDRESSES.DELETE(id)}`, {
//         method: 'DELETE',
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
//       }

//       return await response.json()
//     } catch (err) {
//       console.error(`Error deleting category with ID ${id}:`, err)
//       throw err
//     }
//   },
//   setAddressDefault: async (id: string) => {
//     try {
//       const response = await fetchWithAuth(`${apiConfig.baseApiURL}${API_ENDPOINTS.ADDRESSES.SET_DEFAULT(id)}`)

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
//       }

//       return await response.json()
//     } catch (err) {
//       console.error(`Error updating category with ID ${id}:`, err)
//       throw err
//     }
//   },
//   getDefaultAddressByUserId: async () => {
//     try {
//       const res = await fetchWithAuth(`${apiConfig.baseApiURL}${API_ENDPOINTS.ADDRESSES.GET_BY_ID_DEFAULT}`)

//       if (!res.ok) {
//         throw new Error('Không thể lấy địa chỉ mặc định')
//       }

//       const json = await res.json()

//       if (json.code === 0) {
//         return json.data as AddressDTO
//       } else {
//         console.warn(json.message)
//         return null
//       }
//     } catch (error) {
//       console.error('Lỗi khi lấy địa chỉ mặc định:', error)
//       return null
//     }
//   },
// }