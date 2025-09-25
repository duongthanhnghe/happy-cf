export const PAYMENT_TRANSACTION_STATUS = {
  PENDING: "pending",
  PAID: "paid",
  FAILED: "failed",
  REFUNDED: "refunded",
} as const;

export type PaymentTransactionStatus =
  typeof PAYMENT_TRANSACTION_STATUS[keyof typeof PAYMENT_TRANSACTION_STATUS];

export const PaymentTransactionStatusText: Record<PaymentTransactionStatus, string> = {
  [PAYMENT_TRANSACTION_STATUS.PENDING]: "Chờ thanh toán",
  [PAYMENT_TRANSACTION_STATUS.PAID]: "Đã thanh toán",
  [PAYMENT_TRANSACTION_STATUS.FAILED]: "Thanh toán thất bại",
  [PAYMENT_TRANSACTION_STATUS.REFUNDED]: "Đã hoàn tiền",
};

export const PaymentTransactionStatusColor: Record<PaymentTransactionStatus, string> = {
  [PAYMENT_TRANSACTION_STATUS.PENDING]: "orange",
  [PAYMENT_TRANSACTION_STATUS.PAID]: "green",
  [PAYMENT_TRANSACTION_STATUS.FAILED]: "red",
  [PAYMENT_TRANSACTION_STATUS.REFUNDED]: "blue",
};
