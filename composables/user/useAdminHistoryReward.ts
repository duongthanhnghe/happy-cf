import { ref, computed } from "vue";
import { usersAPI } from "@/services/v1/admin/users.service";
import type { RewardHistoryPaginationDTO } from "@/server/types/dto/v1/reward-history.dto";

export const useAdminHistoryReward = () => {
  
  const listData = ref<RewardHistoryPaginationDTO>();

  const fetchListOrder = async (page: number, limit: number, userId: string) => {
    try {
      const data: RewardHistoryPaginationDTO = await usersAPI.getAllRewardHistory(page, limit, userId)
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