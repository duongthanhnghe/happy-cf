import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS } from '@/services/const/api.const'
import type { ApiResponse } from '@server/types/common/api-response'
import type { ImageBlockPage, ImageBlockPosition } from '@/server/shared/constants/image-block'

export const imageBlocksAPI = {
  getByPage: async (
    page: ImageBlockPage,
    positionLimits?: Partial<Record<ImageBlockPosition, number>>
  ): Promise<ApiResponse<any>> => {
    try {
      const params = new URLSearchParams({ page })

      if (positionLimits) {
        params.append(
          'positionLimits',
          JSON.stringify(positionLimits)
        )
      }

      const response = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.IMAGE_BLOCKS.GET_BY_PAGE}?${params.toString()}`
      )

      return await response.json()
    } catch (err) {
      console.error('Fetch image block error:', err)
      return { code: 1, message: 'Fetch error', data: null }
    }
  }
}
