import { API_ENDPOINTS_ADMIN } from "@/services/const/api-endpoints-admin"
import { apiAdmin } from "@/services/http/apiAdmin"
import type { ApiResponse } from "@server/types/common/api-response"
import type {
  PaymentTransactionDTO,
  PaymentTransactionPaginationDTO,
  PaymentTransactionStatus,
  UpdatePaymentTransactionStatusBody,
} from "@/server/types/dto/v1/payment-transaction.dto"
import { apiError } from '@/server/types/common/api-response'
import { paginationError } from '@/server/types/common/pagination.dto'

export const paymentTransactionsAPI = {
  getAll: async (
    page = 1,
    limit = 10,
    fromDate = "",
    toDate = "",
    search = "",
    status = "",
    method = ""
  ): Promise<PaymentTransactionPaginationDTO> => {
    try {
      const params: Record<string, string> = {
        page: page.toString(),
        limit: limit.toString(),
      }

      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;
      if (search) params.search = search
      if (status) params.status = status
      if (method) params.method = method

      return await apiAdmin().get<PaymentTransactionPaginationDTO>(
        API_ENDPOINTS_ADMIN.PAYMENT_TRANSACTIONS.LIST,
        params
      )
    } catch (err: any) {
      console.error("Error fetching payment transactions:", err)
      return paginationError<PaymentTransactionDTO>(page, limit, err)
    }
  },

  getDetail: async (id: string): Promise<ApiResponse<PaymentTransactionDTO>> => {
    try {
      return await apiAdmin().get<ApiResponse<PaymentTransactionDTO>>(
        API_ENDPOINTS_ADMIN.PAYMENT_TRANSACTIONS.GET_BY_ID(id)
      )
    } catch (err: any) {
      console.error(`Error getting payment transaction detail with ID ${id}:`, err)
      return apiError<PaymentTransactionDTO>(err)
    }
  },

  updateStatus: async (
    transactionId: string,
    status: PaymentTransactionStatus
  ): Promise<ApiResponse<PaymentTransactionDTO>> => {
    try {
      const bodyData: UpdatePaymentTransactionStatusBody = { transactionId, status }
      return await apiAdmin().put<ApiResponse<PaymentTransactionDTO>>(
        API_ENDPOINTS_ADMIN.PAYMENT_TRANSACTIONS.UPDATE_STATUS,
        bodyData
      )
    } catch (err: any) {
      console.error("Error updating payment transaction status:", err)
      return apiError<PaymentTransactionDTO>(err)
    }
  },
}
