import type { PaginationDTO } from "../../common/pagination.dto"

export type PaymentMethod = "cash" | "bank_transfer" | "vnpay" | "momo"
export type PaymentTransactionStatus = "pending" | "paid" | "failed" | "refunded"

export interface PaymentTransactionDTO {
  id: string
  orderId: string
  orderCode?: string
  txnRef: string
  amount: number
  method: PaymentMethod
  status: PaymentTransactionStatus
  statusText: string
  statusColor: string
  vnpTransactionNo?: string
  paidAt?: string
  createdAt: string
  updatedAt: string
}

export type PaymentTransactionPaginationDTO = PaginationDTO<PaymentTransactionDTO>
