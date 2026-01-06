// import type { ImageBlockPage, ImageBlockPosition } from '@/server/types/dto/v1/image-block.dto'
// import { apiConfig } from '@/services/config/api.config'
// import { API_ENDPOINTS } from '@/services/const/api.const'
// import type { ApiResponse } from '@server/types/common/api-response'

// export const imageBlocksAPI = {
//   getByPage: async (
//     page: ImageBlockPage,
//     positionLimits?: Partial<Record<ImageBlockPosition, number>>
//   ): Promise<ApiResponse<any>> => {
//     try {
//       const params = new URLSearchParams({ page })

//       if (positionLimits) {
//         params.append(
//           'positionLimits',
//           JSON.stringify(positionLimits)
//         )
//       }

//       const response = await fetch(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS.IMAGE_BLOCKS.GET_BY_PAGE}?${params.toString()}`
//       )

//       return await response.json()
//     } catch (err) {
//       console.error('Fetch image block error:', err)
//       return { code: 1, message: 'Fetch error', data: null }
//     }
//   }
// }

import type { ImageBlockPage, ImageBlockPosition } from '@/server/types/dto/v1/image-block.dto'
import type { ApiResponse } from '@server/types/common/api-response'
import { apiClient } from '../http/apiClient'
import { API_ENDPOINTS } from '@/services/const/api.const'

export const imageBlocksAPI = {
  getByPage: async (
    page: ImageBlockPage,
    positionLimits?: Partial<Record<ImageBlockPosition, number>>
  ): Promise<ApiResponse<any>> => {
    try {
      const params: Record<string, any> = { page }

      if (positionLimits) {
        params.positionLimits = JSON.stringify(positionLimits)
      }

      const result = await apiClient().get<ApiResponse<any>>(
        API_ENDPOINTS.IMAGE_BLOCKS.GET_BY_PAGE,
        params
      )

      if (result.code !== 0) {
        throw new Error(result.message || 'Fetch image block error')
      }

      return result
    } catch (err: any) {
      console.error('[imageBlocksAPI.getByPage]', err)
      return { code: 1, message: err.message ?? 'Fetch error', data: null }
    }
  }
}
