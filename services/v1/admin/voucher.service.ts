import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin'
import type {
  VoucherDTO,
  CreateVoucherBody,
  VoucherPaginationDTO,
  ApplyVoucherProduct,
  ApplyVoucherResponse,
  VoucherAvailableDTO,
} from '@/server/types/dto/v1/voucher.dto'
import type { ApiResponse } from '@server/types/common/api-response'

export const vouchersAPI = {
  // 📄 Lấy danh sách voucher
  getAll: async (page = 1, limit = 10): Promise<VoucherPaginationDTO> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      const response = await fetch(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VOUCHERS.LIST}?${params}`,
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

  // 📄 Lấy chi tiết voucher theo ID
  getDetail: async (id: string): Promise<ApiResponse<VoucherDTO>> => {
    try {
      const response = await fetch(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VOUCHERS.GET_BY_ID(id)}`,
        { credentials: 'include' }
      )

      if (!response.ok) throw new Error(`Failed to fetch voucher with ID ${id}`)

      const data = await response.json()
      return data
    } catch (err) {
      console.error(`Error fetching voucher detail ${id}:`, err)
      throw err
    }
  },

  // ➕ Tạo voucher mới
  create: async (body: CreateVoucherBody): Promise<ApiResponse<VoucherDTO>> => {
    try {
      const response = await fetch(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VOUCHERS.CREATE}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body),
        }
      )

      const data = await response.json()
      return data
    } catch (err) {
      console.error('Error creating voucher:', err)
      throw err
    }
  },

  // ✏️ Cập nhật voucher
  update: async (
    id: string,
    body: Partial<CreateVoucherBody>
  ): Promise<ApiResponse<VoucherDTO>> => {
    try {
      const response = await fetch(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VOUCHERS.UPDATE(id)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(body),
        }
      )

      const data = await response.json()
      return data
    } catch (err) {
      console.error(`Error updating voucher ${id}:`, err)
      throw err
    }
  },

  // 🗑️ Xóa voucher
  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await fetch(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VOUCHERS.DELETE(id)}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      )

      const data = await response.json()
      return data
    } catch (err) {
      console.error(`Error deleting voucher ${id}:`, err)
      throw err
    }
  },

  // 🔄 Toggle trạng thái hoạt động
  toggleActive: async (id: string): Promise<ApiResponse<VoucherDTO>> => {
    try {
      const response = await fetch(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VOUCHERS.TOGGLE_ACTIVE(id)}`,
        {
          method: 'PATCH',
          credentials: 'include',
        }
      )

      const data = await response.json()
      return data
    } catch (err) {
      console.error(`Error toggling voucher ${id}:`, err)
      throw err
    }
  },

  // 💰 Áp dụng voucher để tính giảm giá
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
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VOUCHERS.APPLY}`,
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

  getAvailableForOrder: async (body: {
    orderTotal: number
    categoryIds?: string[]
    userId?: string
  }): Promise<ApiResponse<VoucherAvailableDTO[]>> => {
    try {
      const response = await fetch(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VOUCHERS.AVAILABLE}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
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
