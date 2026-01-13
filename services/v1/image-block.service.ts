import type { ImageBlockPage, ImageBlockPosition } from '@/server/types/dto/v1/image-block.dto'
import { type ApiResponse } from '@/server/types/common/api-response'
import { apiError } from '@/server/types/common/api-response'
import { apiClient } from '../http/apiClient'
import { API_ENDPOINTS } from '@/services/const/api.const'

export const imageBlocksAPI = {
  getByPage: async (
    page: ImageBlockPage,
    positionLimits?: Partial<Record<ImageBlockPosition, number>>
  ): Promise<ApiResponse<Record<ImageBlockPosition, any[]>>> => {
    try {
      const params: Record<string, any> = { page }

      if (positionLimits) {
        params.positionLimits = JSON.stringify(positionLimits)
      }

      return await apiClient().get<
        ApiResponse<Record<ImageBlockPosition, any[]>>
      >(
        API_ENDPOINTS.IMAGE_BLOCKS.GET_BY_PAGE,
        params
      )
    } catch (err: any) {
      console.error('[imageBlocksAPI.getByPage]', err)
      return apiError<Record<ImageBlockPosition, any[]>>(err)
    }
  }
}