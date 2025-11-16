import { type Ref } from 'vue';
import type { RewardHistoryPaginationDTO } from '@/server/types/dto/v1/reward-history.dto';
import { useHistoryRewardByUser } from "@/composables/user/useHistoryRewardByUser";

export const useHistoryRewardUtils = (
  limit: number,
  items: Ref<RewardHistoryPaginationDTO|null>,
  isTogglePopup: Ref<boolean>,
  userId: string,
) => {

  const { loadingData, getListOrder, fetchListOrder } = useHistoryRewardByUser()

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
    await fetchListOrder(userId, 1, limit)
    if(getListOrder.value) items.value = getListOrder.value
  }

  const handleTogglePopup = async (value: boolean) => {
    isTogglePopup.value = value;
    if(!getListOrder.value) await getDataInit()
  }

  return {
    loadingData,
    load,
    getDataInit,
    handleTogglePopup,
  };
};