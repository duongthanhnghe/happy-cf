import type { ApiResponse } from "@server/types/common/api-response"
import type { PaymentTransactionDTO } from "@/server/types/dto/v1/payment-transaction.dto"
import { apiError } from '@/server/types/common/api-response'
import { apiClient } from "../http/apiClient"
import { API_ENDPOINTS } from "../const/api.const"

export const paymentTransactionsAPI = {
  getDetail: async (id: string): Promise<ApiResponse<PaymentTransactionDTO>> => {
    try {
      return await apiClient().get<ApiResponse<PaymentTransactionDTO>>(
        API_ENDPOINTS.PAYMENT_TRANSACTIONS.GET_BY_ID(id)
      )
    } catch (err: any) {
      console.error(`Error getting payment transaction detail with ID ${id}:`, err)
      return apiError<PaymentTransactionDTO>(err)
    }
  },
}
