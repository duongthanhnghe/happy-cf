import type { PaymentTransactionDTO } from "../../types/dto/v1/payment-transaction.dto"
import type { PaymentTransactionDocument } from "../../models/v1/payment-transaction.entity"
import {
  PaymentTransactionStatusText,
  PaymentTransactionStatusColor,
} from "../../shared/constants/payment-transaction-status"

export function toPaymentTransactionDTO(
  entity: PaymentTransactionDocument
): PaymentTransactionDTO {
  
  const order: any = entity.orderId

  return {
    id: entity._id?.toString() || "",
    orderId:
      typeof order === "string"
        ? order
        : order?._id?.toString() || "",

    orderCode:
      typeof order === "object" && order?.code
        ? order.code
        : undefined,
    txnRef: entity.txnRef,
    amount: entity.amount,
    method: entity.method,
    status: entity.status,
    statusText: PaymentTransactionStatusText[entity.status],
    statusColor: PaymentTransactionStatusColor[entity.status],
    vnpTransactionNo: entity.vnpTransactionNo,
    paidAt: entity.paidAt ? entity.paidAt.toISOString() : undefined,
    createdAt: entity.createdAt?.toISOString() || "",
    updatedAt: entity.updatedAt?.toISOString() || "",
  }
}

export const toPaymentTransactionListDTO = (
  list: PaymentTransactionDocument[]
): PaymentTransactionDTO[] => list.map(toPaymentTransactionDTO)
