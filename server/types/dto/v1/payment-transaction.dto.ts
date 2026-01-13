import type { PaginationDTO } from "../../common/pagination.dto"

export type PaymentMethod = "cash" | "bank_transfer"
export type PaymentTransactionStatus = "pending" | "paid" | "failed" | "refunded"

export interface PaymentTransactionDTO {
  id: string
  orderId: string
  amount: number
  method: PaymentMethod
  status: PaymentTransactionStatus
  statusText: string
  statusColor: string
  createdAt: string
  updatedAt: string
}

export interface CreatePaymentTransactionBody {
  orderId: string
  amount: number
  method: PaymentMethod
}

export interface UpdatePaymentTransactionStatusBody {
  transactionId: string
  status: PaymentTransactionStatus
}

export type PaymentTransactionPaginationDTO = PaginationDTO<PaymentTransactionDTO>
