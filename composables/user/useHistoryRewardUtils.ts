import { type Ref } from 'vue';
import type { RewardHistoryPaginationDTO } from '@/server/types/dto/v1/reward-history.dto';
import { useHistoryRewardByUser } from "@/composables/user/useHistoryRewardByUser";

export const useHistoryRewardUtils = (
  limit: number,
  items: Ref<RewardHistoryPaginationDTO|null>,
  loadingData: Ref<boolean>,
  userId: string,
) => {

  const { getListOrder, fetchListOrder } = useHistoryRewardByUser()

  async function load({ done }: { done: (status: 'ok' | 'empty') => void }) {
    if(!items.value || !userId) return
    try {
      const currentPage = items.value.pagination.page
      const totalPages = items.value.pagination.totalPages

      if (currentPage >= totalPages) {
        done('empty')
        return
      }

      const nextPage = currentPage + 1
      await fetchListOrder(userId,nextPage, limit)

      if (getListOrder.value && getListOrder.value.data && getListOrder.value.data.length > 0) {
        items.value.data.push(...getListOrder.value.data)
        items.value.pagination = getListOrder.value.pagination
        done('ok')
      } else {
        done('empty')
      }
    } catch (err) {
      console.error('Error loading more products:', err)
      done('empty')
    }
  }

  const getDataInit = async () => {
    if(!userId) return
    loadingData.value = true;

    const data = await fetchListOrder(userId, 1, limit)
    if(data.code !== 0) return loadingData.value = false;

    if(getListOrder.value) items.value = getListOrder.value

    loadingData.value = false;
  }

  return {
    load,
    getDataInit,
  };
};