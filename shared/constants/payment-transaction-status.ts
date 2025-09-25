import type { PaymentTransactionStatus } from "@/server/types/dto/payment-transaction.dto"

export interface StatusItem {
  name: string;
  status: PaymentTransactionStatus;
}

export const PAYMENT_TRANSACTION_STATUS: Record<PaymentTransactionStatus, StatusItem> = {
  pending: {
    name: "Chờ thanh toán",
    status: "pending",
  },
  paid: {
    name: "Đã thanh toán",
    status: "paid",
  },
  failed: {
    name: "Thanh toán thất bại",
    status: "failed",
  },
  refunded: {
    name: "Đã hoàn tiền",
    status: "refunded",
  },
};