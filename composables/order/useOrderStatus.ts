import { ref, computed } from "vue";
import { ordersAPI } from "@/services/orders.service";
import type { OrderStatusDTO } from '@/server/types/dto/order.dto'

export const useOrderStatus = () => {
  const listOrderStatus = ref<OrderStatusDTO[]>([])

  const fetchOrderStatus = async () => {
    try {
      const data = await ordersAPI.getAllStatus()
      listOrderStatus.value = data.data;
    } catch (err) {
      console.error('Error status', err)
    }
  }

  const getOrderStatusItem = (id: string) => {
    if(listOrderStatus.value.length === 0) fetchOrderStatus()
    return listOrderStatus.value.find(item => item.id === id) || { name: '', status: '' }
  }

  const getListOrderStatus = computed(() => listOrderStatus.value);

  return {
    listOrderStatus,
    fetchOrderStatus,
    getOrderStatusItem,
    getListOrderStatus
  }
}