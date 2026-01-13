import { apiClient } from '@/services/http/apiClient'
import { API_ENDPOINTS } from '@/services/const/api.const'
import type {
  AddressDTO,
  CreateAddressBody
} from '@/server/types/dto/v1/address.dto'
import type { ApiResponse } from '@/server/types/common/api-response'
import { apiError } from '@/server/types/common/api-response'

export const addressesAPI = {
  getAll: async (): Promise<ApiResponse<AddressDTO[]>> => {
    try {
      return await apiClient().authGet<ApiResponse<AddressDTO[]>>(
        API_ENDPOINTS.ADDRESSES.LIST
      )
    } catch (err: any) {
      console.error('[addressesAPI.getAll]', err)
      return apiError<AddressDTO[]>(err)
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
      return apiError<AddressDTO>(err)
    }
  },

  getDetail: async (id: string): Promise<ApiResponse<AddressDTO>> => {
    try {
      return await apiClient().authGet<ApiResponse<AddressDTO>>(
        API_ENDPOINTS.ADDRESSES.GET_BY_ID(id)
      )
    } catch (err: any) {
      console.error(`[addressesAPI.getDetail] id=${id}`, err)
      return apiError<AddressDTO>(err)
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
      return apiError<AddressDTO>(err)
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      return await apiClient().authDelete<ApiResponse<null>>(
        API_ENDPOINTS.ADDRESSES.DELETE(id)
      )
    } catch (err: any) {
      console.error(`[addressesAPI.delete] id=${id}`, err)
      return apiError<null>(err)
    }
  },

  setAddressDefault: async (id: string): Promise<ApiResponse<AddressDTO>> => {
    try {
      return await apiClient().authPost<ApiResponse<AddressDTO>>(
        API_ENDPOINTS.ADDRESSES.SET_DEFAULT(id)
      )
    } catch (err: any) {
      console.error(`[addressesAPI.setAddressDefault] id=${id}`, err)
      return apiError<AddressDTO>(err)
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