import { PAYMENT_TRANSACTION_STATUS } from "@/shared/constants/payment-transaction-status";
import { ORDER_STATUS } from "@/shared/constants/order-status";

export function getTransactionNote (statusTransaction?: string, statusOrder?: string): string {
  if (!statusTransaction || !statusOrder) return "";

  const tx = statusTransaction.toLowerCase();
  const ord = statusOrder.toLowerCase();

  switch (tx) {
    case PAYMENT_TRANSACTION_STATUS.paid.status:
      switch (ord) {
        case ORDER_STATUS.CANCELLED:
          return "Cần xử lý hoàn tiền";
        // case ORDER_STATUS.COMPLETED:
        //   return "Đã thanh toán — đơn hoàn tất";
        default:
          return "";
      }

    case PAYMENT_TRANSACTION_STATUS.pending.status:
      switch (ord) {
        case ORDER_STATUS.COMPLETED:
          return "Cần xử lý thu tiền từ khách";
        case ORDER_STATUS.CANCELLED:
          return "Đơn đã hủy — giao dịch đang chờ, cần huỷ thanh toán";
        default:
          return "Thanh toán đang chờ xử lý";
      }

    case PAYMENT_TRANSACTION_STATUS.failed.status:
      return ord === ORDER_STATUS.CANCELLED
        ? "" // Đơn đã huỷ — không cần xử lý thêm
        : "Thanh toán thất bại — liên hệ khách để xử lý";

    case PAYMENT_TRANSACTION_STATUS.refunded?.status:
      // return "Đã hoàn tiền cho khách";
      return "";

    default:
      return "";
  }
};
