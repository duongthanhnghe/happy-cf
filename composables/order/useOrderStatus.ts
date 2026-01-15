import { computed } from "vue";
import { ordersAPI } from "@/services/v1/orders.service";
import type { OrderStatusDTO } from '@/server/types/dto/v1/order.dto'
import { useState } from "nuxt/app";

export const useOrderStatus = () => {
  const listOrderStatus = useState<OrderStatusDTO[]>('list-order-status', () => [])

  const fetchOrderStatus = async () => {
    try {
      const data = await ordersAPI.getAllStatus()
      if(data.code === 0){
        listOrderStatus.value = data.data;
      }
    } catch (err) {
      console.error('Error status', err)
    }
  }

  const getListOrderStatus = computed(() => listOrderStatus.value);

  return {
    fetchOrderStatus,
    getListOrderStatus
  }
}