import { apiClient } from '@/services/http/apiClient'
import { API_ENDPOINTS } from '@/services/const/api.const'
import type { BannerDTO } from '@/server/types/dto/v1/banner.dto'
import type { ApiResponse } from '@server/types/common/api-response'

export const bannersAPI = {
  getAll: async (): Promise<ApiResponse<BannerDTO[]>> => {
    try {
      return await apiClient().get<ApiResponse<BannerDTO[]>>(API_ENDPOINTS.BANNERS.LIST)
    } catch (err: any) {
      console.error('[bannersAPI.getAll]', err)
      return {
        code: 1,
        message: err.message ?? 'Failed to fetch banners',
        data: [],
      }
    }
  },
}

// import { apiConfig } from '@/services/config/api.config'
// import { API_ENDPOINTS } from '@/services/const/api.const'
// import type { BannerDTO } from '@/server/types/dto/v1/banner.dto'
// import type { ApiResponse } from '@server/types/common/api-response'

// export const bannersAPI = {
//   getAll: async (): Promise<ApiResponse<BannerDTO[]>> => {
//   try {
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.BANNERS.LIST}`)
//       const data = await response.json()
//       return data;
//     } catch (err) {
//       console.error('Error:', err)
//       return {
//         code: 1,
//         message: 'Failed to fetch banners',
//         data: []
//       }
//     }
//   },
// }