import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin'
import type {
  VoucherUsagePaginationDTO,
} from '@/server/types/dto/v1/voucher-usage.dto'
import type { ApiResponse } from '@server/types/common/api-response'

export const vouchersUsageAPI = {
  getAll: async (page = 1, limit = 10): Promise<VoucherUsagePaginationDTO> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      const response = await fetch(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VOUCHERS_USAGE.LIST}?${params}`,
        { credentials: 'include' }
      )

      const data = await response.json()
      return data
    } catch (err) {
      console.error('Error fetching vouchers:', err)
      return {
        code: 1,
        message: 'Failed to fetch vouchers',
        data: [],
        pagination: { total: 0, totalPages: 0, page, limit },
      }
    }
  },

}
