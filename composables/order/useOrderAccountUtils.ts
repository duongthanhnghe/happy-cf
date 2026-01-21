import { showConfirm, showSuccess, showWarning } from "@/utils/toast";
import { Loading } from "@/utils/global";
import { ordersAPI } from "@/services/v1/orders.service";
import { type Ref } from 'vue';
import { useRouter } from 'vue-router'
import type { OrderPaginationDTO } from "@/server/types/dto/v1/order.dto";
import { ROUTES } from "@/shared/constants/routes";
import { PAYMENT_STATUS } from '@/shared/constants/payment-status';
import { usePayment } from '@/composables/order/usePayment';

export const useOrderAccountUtils = (
  items: Ref<OrderPaginationDTO|null>,
) => {
  const router = useRouter()
  const { payWithVnpay, payWithMomo } = usePayment()

  const handlePaymentOrder = async (orderId: string, methodId: string, orderCode: string, amount: number) => {
    if(methodId === PAYMENT_STATUS.BANK){
      router.push({
        path: ROUTES.PUBLIC.PAYMENT.path,
        query: {
          orderId,
          orderCode,
          amount,
        }
      })
    } else if (methodId === PAYMENT_STATUS.MOMO) {
      await payWithMomo(orderId)
    } else if (methodId === PAYMENT_STATUS.VNPAY) {
      await payWithVnpay(orderId)
    } else {
      return false
    }
  }

  const handleCancelOrder = async (orderId: string, userId: string) => {
    const confirm = await showConfirm('Bạn có chắc chắn huỷ?')
    if (!confirm) return

    try {
      Loading(true)
      const data = await ordersAPI.cancelOrderByUser(orderId, userId);
      if(data.code === 0){
        showSuccess(data.message ?? '')
        const order = items.value?.data.find(o => o.id === orderId)
        if (order) order.cancelRequested = true
      } else {
        showWarning(data.message ?? '')
      }
    } catch (err) {
      console.error('Error loading more products:', err)
    } finally {
      Loading(false)
    }
  }

  return {
    handlePaymentOrder,
    handleCancelOrder,
  };
};