import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS } from '@/services/const/api.const'
import type { ApiResponse } from '@server/types/common/api-response'
import type {
  PaymentTransactionDTO,
  CreatePaymentTransactionBody,
  UpdatePaymentTransactionStatusBody,
  PaymentTransactionPaginationDTO,
  PaymentTransactionStatus,
} from '@/server/types/dto/v1/payment-transaction.dto'

export const paymentTransactionsAPI = {
  // 🔹 Lấy danh sách giao dịch có phân trang
  getAll: async (
    page = 1,
    limit = 10,
    search = ""
  ): Promise<PaymentTransactionPaginationDTO> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })
      if (search) params.append("search", search)

      const response = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.PAYMENT_TRANSACTIONS.LIST}?${params}`
      )
      const data = await response.json()
      return data
    } catch (err) {
      console.error("Error fetching payment transactions:", err)
      return {
        code: 1,
        message: "Failed to fetch payment transactions",
        data: [],
        pagination: {
          total: 0,
          totalPages: 0,
          page: 1,
          limit,
        },
      }
    }
  },

  // 🔹 Tạo transaction mới (thường khi admin CONFIRMED order)
  create: async (
    bodyData: CreatePaymentTransactionBody
  ): Promise<ApiResponse<PaymentTransactionDTO>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.PAYMENT_TRANSACTIONS.CREATE}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          code: 1,
          message: errorData.message || "Failed to create payment transaction",
          data: undefined as any,
        }
      }

      const data: ApiResponse<PaymentTransactionDTO> = await response.json()
      return data
    } catch (err) {
      console.error("Error creating payment transaction:", err)
      return {
        code: 1,
        message: "Unexpected error while creating payment transaction",
        data: undefined as any,
      }
    }
  },

  // 🔹 Update status transaction
  updateStatus: async (
    transactionId: string,
    status: PaymentTransactionStatus
  ): Promise<ApiResponse<PaymentTransactionDTO>> => {
    try {
      const bodyData: UpdatePaymentTransactionStatusBody = { transactionId, status }

      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.PAYMENT_TRANSACTIONS.UPDATE_STATUS}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          code: 1,
          message: errorData.message || "Failed to update transaction status",
          data: undefined as any,
        }
      }

      const data: ApiResponse<PaymentTransactionDTO> = await response.json()
      return data
    } catch (err) {
      console.error("Error updating payment transaction status:", err)
      return {
        code: 1,
        message: "Unexpected error while updating transaction status",
        data: undefined as any,
      }
    }
  },

  // 🔹 Xoá transaction
  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.PAYMENT_TRANSACTIONS.DELETE(id)}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          code: 1,
          message: errorData.message || "Failed to delete payment transaction",
          data: null,
        }
      }

      return await response.json()
    } catch (err) {
      console.error(`Error deleting payment transaction with ID ${id}:`, err)
      return {
        code: 1,
        message: "Unexpected error while deleting transaction",
        data: null,
      }
    }
  },

  // 🔹 Get detail transaction
  getDetail: async (id: string): Promise<ApiResponse<PaymentTransactionDTO>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.PAYMENT_TRANSACTIONS.GET_BY_ID(id)}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch payment transaction with ID ${id}`)
      }
      const data = await response.json()
      return data
    } catch (err) {
      console.error(`Error getting payment transaction detail with ID ${id}:`, err)
      throw err
    }
  },
}
