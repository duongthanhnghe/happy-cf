import { ordersAPI } from "@/services/v1/orders.service";
import { showWarning } from "@/utils/toast";

export const usePayment = () => {

  const payWithVnpay = async (orderId: string) => {
    try {
      const res = await ordersAPI.createVnpayPayment(orderId)

      if (res.code === 0 && res.data?.paymentUrl) {
        window.location.href = res.data.paymentUrl
        return true
      }

      showWarning('Không thể tạo thanh toán VNPay!')
      return false

    } catch (err) {
      console.error('VNPay payment error:', err)
      showWarning('Có lỗi xảy ra khi tạo thanh toán VNPay!')
      return false
    }
  }

  const payWithMomo = async (orderId: string) => {
    try {
      const res = await ordersAPI.createMomoPayment(orderId)

      if (res.code === 0 && res.data?.payUrl) {
        window.location.href = res.data.payUrl
        return true
      }

      showWarning('Không thể tạo thanh toán MOMO!')
      return false

    } catch (err) {
      console.error('MOMO payment error:', err)
      showWarning('Có lỗi xảy ra khi tạo thanh toán MOMO!')
      return false
    }
  }

  return {
    payWithVnpay,
    payWithMomo,
  }
}
