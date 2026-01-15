import { ref, computed } from "vue";
import { ordersAPI } from "@/services/v1/admin//orders.service";
import type { OrderDTO } from '@/server/types/dto/v1/order.dto'

export const useOrderDetail = () => {
  
  const detailOrder = ref<OrderDTO|null>(null);

  const fetchOrderDetail = async (id: string) => {
    try {
      const data = await ordersAPI.getDetail(id)
      if(data.code === 0 && data.data.cartItems?.length > 0){
        detailOrder.value = data.data
      } 
    } catch (err) {
      console.error('Error status', err)
    }
  }

  const getDetailOrder = computed(() => detailOrder.value);
  
  return {
    detailOrder,
    fetchOrderDetail,
    getDetailOrder
  }
}