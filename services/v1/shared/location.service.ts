import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS_SHARED } from '@/services/const/api.endpoints-shared'
import type { ApiResponse } from '@/server/types/common/api-response'
import type { ProvinceDTO, DistrictDTO, WardDTO } from '@/server/types/dto/v1/location.dto'

export const locationAPI = {
  getProvinces: async (): Promise<ApiResponse<ProvinceDTO[]>> => {
    try {
      const res = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS_SHARED.LOCATION.PROVINCES}`)
      const data = await res.json()
      return data
    } catch (err: any) {
      console.error('Error fetching provinces:', err)
      return {
        code: 1,
        message: err.message ?? 'Failed to fetch provinces',
        data: []
      }
    }
  },

  getDistrictsByProvince: async (provinceCode: number): Promise<ApiResponse<DistrictDTO[]>> => {
    try {
      const res = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS_SHARED.LOCATION.DISTRICTS(provinceCode)}`)
      const data = await res.json()
      return data
    } catch (err: any) {
      console.error(`Error fetching districts for province ${provinceCode}:`, err)
      return {
        code: 1,
        message: err.message ?? 'Failed to fetch districts',
        data: []
      }
    }
  },

  getWardsByDistrict: async (districtCode: number): Promise<ApiResponse<WardDTO[]>> => {
    try {
      const res = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS_SHARED.LOCATION.WARDS(districtCode)}`)
      const data = await res.json()
      return data
    } catch (err: any) {
      console.error(`Error fetching wards for district ${districtCode}:`, err)
      return {
        code: 1,
        message: err.message ?? 'Failed to fetch wards',
        data: []
      }
    }
  },

  getProvinceDetail: async (provinceCode: number | string): Promise<ApiResponse<ProvinceDTO>> => {
    try {
      const res = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS_SHARED.LOCATION.PROVINCE_DETAIL(provinceCode)}`)
      const data = await res.json()
      return data
    } catch (err: any) {
      console.error(`Error fetching province ${provinceCode}:`, err)
      return { code: 1, message: err.message ?? 'Failed to fetch province detail', data: null as any }
    }
  },

  getDistrictDetail: async (districtCode: number | string): Promise<ApiResponse<DistrictDTO>> => {
    try {
      const res = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS_SHARED.LOCATION.DISTRICT_DETAIL(districtCode)}`)
      const data = await res.json()
      return data
    } catch (err: any) {
      console.error(`Error fetching district ${districtCode}:`, err)
      return { code: 1, message: err.message ?? 'Failed to fetch district detail', data: null as any }
    }
  },

  getWardDetail: async (wardCode: number | string, districtCode: number | string): Promise<ApiResponse<WardDTO>> => {
    try {
      const res = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS_SHARED.LOCATION.WARD_DETAIL(wardCode, districtCode)}`)
      const data = await res.json()
      return data
    } catch (err: any) {
      console.error(`Error fetching ward ${wardCode}:`, err)
      return { code: 1, message: err.message ?? 'Failed to fetch ward detail', data: null as any }
    }
  }
}