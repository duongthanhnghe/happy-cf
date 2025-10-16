import { ref, computed } from "vue";
import { ordersAPI } from "@/services/v1/admin/orders.service";
import type { OrderStatusDTO } from '@/server/types/dto/v1/order.dto'

export const useOrderStatus = () => {
  const listOrderStatus = ref<OrderStatusDTO[]>([])

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

  const getOrderStatusItem = (id: string) => {
    if(listOrderStatus.value.length === 0) fetchOrderStatus()
    return listOrderStatus.value.find(item => item.id === id) || { name: '', status: '' }
  }

  const getListOrderStatus = computed(() => listOrderStatus.value);

  return {
    fetchOrderStatus,
    getOrderStatusItem,
    getListOrderStatus
  }
}