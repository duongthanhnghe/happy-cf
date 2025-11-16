import { ref, computed } from "vue";
import { ordersAPI } from "@/services/v1/orders.service";
import type { RewardHistoryPaginationDTO } from "@/server/types/dto/v1/reward-history.dto";

export const useHistoryRewardByUser = () => {
  
  const listData = ref<RewardHistoryPaginationDTO|null>(null);
  const loadingData = ref(false)

  const fetchListOrder = async (userId: string, page: number, limit: number) => {
    loadingData.value = true
    try {
      const data: RewardHistoryPaginationDTO = await ordersAPI.getRewardHistoryByUserId(userId, page, limit)
      if(data.code === 0) {
        listData.value = data
      }
      return data
    } catch (err) {
      console.error('Error product all', err)
      return null
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