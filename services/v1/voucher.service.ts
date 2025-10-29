import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS } from '@/services/const/api.const'
import type {
  ApplyVoucherProduct,
  ApplyVoucherResponse,
  VoucherAvailableDTO,
} from '@/server/types/dto/v1/voucher.dto'
import type { ApiResponse } from '@server/types/common/api-response'

export const vouchersAPI = {
  apply: async (
    payload: {
      code: string
      orderTotal: number
      products?: ApplyVoucherProduct[]
      orderCreatedAt?: string
      userId: string
    }
  ): Promise<ApiResponse<ApplyVoucherResponse>> => {
    try {
      const response = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.VOUCHERS.APPLY}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(payload),
        }
      )

      const data = await response.json()
      return data
    } catch (err) {
      console.error('Error applying voucher:', err)
      throw err
    }
  },
  getAvailable: async (body: {
    orderTotal: number
    categoryIds?: string[]
    userId?: string
  }): Promise<ApiResponse<VoucherAvailableDTO[]>> => {
    try {
      const response = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.VOUCHERS.AVAILABLE}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(body),
        }
      )

      const data = await response.json()
      return data
    } catch (err) {
      console.error('Error fetching available vouchers for order:', err)
      return {
        code: 1,
        message: 'Không thể lấy danh sách voucher khả dụng',
        data: [],
      } as ApiResponse<VoucherAvailableDTO[]>
    }
  },

}
