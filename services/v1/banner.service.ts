import { apiClient } from '@/services/http/apiClient'
import { API_ENDPOINTS } from '@/services/const/api.const'
import type { BannerDTO } from '@/server/types/dto/v1/banner.dto'
import { apiError, type ApiResponse } from '@/server/types/common/api-response'

export const bannersAPI = {
  getAll: async (): Promise<ApiResponse<BannerDTO[]>> => {
    try {
      return await apiClient().get<ApiResponse<BannerDTO[]>>(API_ENDPOINTS.BANNERS.LIST)
    } catch (err: any) {
      console.error('[bannersAPI.getAll]', err)
      return apiError<BannerDTO[]>(err)
    }
  },
}
