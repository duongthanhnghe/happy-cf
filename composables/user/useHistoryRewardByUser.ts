import { ref, computed } from "vue";
import { ordersAPI } from "@/services/orders.service";
import type { OrderPaginationDTO } from "@/server/types/dto/order.dto";
export const useHistoryRewardByUser = () => {
  
  const listData = ref<OrderPaginationDTO>();

  const fetchListOrder = async (userId: string, page: number, limit: number) => {
    try {
      const data: OrderPaginationDTO = await ordersAPI.getRewardHistoryByUserId(userId, page, limit)
      if(data.code === 0) {
        listData.value = data
        return data
      }
    } catch (err) {
      console.error('Error product all', err)
    }
  }

  const getListOrder = computed(() => listData.value);

  return {
    fetchListOrder,
    getListOrder
  }
}