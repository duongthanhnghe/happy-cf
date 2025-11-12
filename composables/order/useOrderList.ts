import { ref, computed } from "vue";
import { ordersAPI } from "@/services/v1/orders.service";
import type { OrderPaginationDTO } from '@/server/types/dto/v1/order.dto'

export const useOrderList = () => {
  const listData = ref<OrderPaginationDTO|null>(null)
  const loadingData = ref<boolean>(false)

  const fetchListOrder = async (userId: string, page: number, limit:number, filterStatusOrder:string) => {
    loadingData.value = true
    try {
      const data = await ordersAPI.getByUserId(userId, page, limit, filterStatusOrder)
      if(data.code === 0){
        listData.value = data
      }
    } catch (err) {
      console.error('Error status', err)
    } finally {
      loadingData.value = false
    }
  }

  const getListOrder = computed(() => listData.value);
  
  return {
    loadingData,
    fetchListOrder,
    getListOrder
  }
}
