import { showSuccess, showWarning } from "@/utils/toast";
import { Loading } from "@/utils/global";
import { ordersAPI } from "@/services/v1/orders.service";
import { type Ref } from 'vue';
import { useRouter } from 'vue-router'
import type { OrderPaginationDTO } from "@/server/types/dto/v1/order.dto";
import { ROUTES } from "@/shared/constants/routes";

export const useOrderAccountUtils = (
  items: Ref<OrderPaginationDTO|null>,
) => {
  const router = useRouter()

  const handlePaymentOrder = (orderId: string, orderCode: string, amount: number) => {
    router.push({
      path: ROUTES.PUBLIC.PAYMENT.path,
      query: {
        orderId,
        orderCode,
        amount,
      }
    })
  }

  const handleCancelOrder = async (orderId: string, userId: string) => {
    try {
      Loading(true)
      const data = await ordersAPI.cancelOrderByUser(orderId, userId);
      if(data.code === 0){
        showSuccess(data.message ?? '')

        const order = items.value?.data.find(o => o.id === orderId)
        if (order) {
          order.cancelRequested = true
        }

      } else {
        showWarning(data.message ?? '')
      }
      Loading(false)
    } catch (err) {
      console.error('Error loading more products:', err)
    }
  }

  return {
    handlePaymentOrder,
    handleCancelOrder,
  };
};