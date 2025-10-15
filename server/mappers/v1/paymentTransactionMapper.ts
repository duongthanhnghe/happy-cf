import type { PaymentTransactionDTO } from "../../types/dto/v1/payment-transaction.dto"
import type { PaymentTransactionDocument } from "../../models/v1/PaymentTransactionEntity"
import {
  PaymentTransactionStatusText,
  PaymentTransactionStatusColor,
} from "../../shared/constants/payment-transaction-status"

export function toPaymentTransactionDTO(
  entity: PaymentTransactionDocument
): PaymentTransactionDTO {
  return {
    id: entity._id?.toString() || "",
    orderId: entity.orderId?.toString() || "",
    amount: entity.amount,
    method: entity.method,
    status: entity.status,
    statusText: PaymentTransactionStatusText[entity.status],
    statusColor: PaymentTransactionStatusColor[entity.status],
    createdAt: entity.createdAt?.toISOString() || "",
    updatedAt: entity.updatedAt?.toISOString() || "",
  }
}

export const toPaymentTransactionListDTO = (
  list: PaymentTransactionDocument[]
): PaymentTransactionDTO[] => list.map(toPaymentTransactionDTO)
