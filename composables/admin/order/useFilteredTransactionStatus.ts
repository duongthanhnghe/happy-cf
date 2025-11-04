import { PAYMENT_TRANSACTION_STATUS } from "@/shared/constants/payment-transaction-status";
import { ORDER_STATUS } from "@/shared/constants/order-status";

export function getFilteredTransactionStatus (statusOrderId: string) {
  const allStatus = Object.values(PAYMENT_TRANSACTION_STATUS);

  // Nếu đơn hàng đã hoàn thành → loại "Đã hoàn tiền"
  if (statusOrderId === ORDER_STATUS.COMPLETED) {
    return allStatus.filter(s => s.status !== PAYMENT_TRANSACTION_STATUS.refunded.status);
  }

  // Nếu đơn hàng bị hủy → loại "Đã thanh toán"
  if (statusOrderId === ORDER_STATUS.CANCELLED) {
    return allStatus.filter(s => s.status !== PAYMENT_TRANSACTION_STATUS.paid.status);
  }

  // Mặc định hiển thị tất cả
  return allStatus;
};