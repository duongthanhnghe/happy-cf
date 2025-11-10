import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useHistoryRewardByUser } from "@/composables/user/useHistoryRewardByUser";
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import type { RewardHistoryPaginationDTO } from "@/server/types/dto/v1/reward-history.dto";

export const useHistoryRewardByUserStore = defineStore("HistoryRewardByUserStore", () => {

  const { getListOrder, fetchListOrder } = useHistoryRewardByUser()
  const storeAccount = useAccountStore();

  const limit = 20
  const items = ref<RewardHistoryPaginationDTO|null>(null)
  const loadingData = ref(false)

  async function load({ done }: { done: (status: 'ok' | 'empty') => void }) {
    if(!items.value || !storeAccount.getUserId) return
    try {
      const currentPage = items.value.pagination.page
      const totalPages = items.value.pagination.totalPages

      if (currentPage >= totalPages) {
        done('empty')
        return
      }

      const nextPage = currentPage + 1
      await fetchListOrder(storeAccount.getUserId,nextPage, limit)

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
    if(!storeAccount.getUserId) return
    loadingData.value = true;

    const data = await fetchListOrder(storeAccount.getUserId, 1, limit)
    if(data.code !== 0) return loadingData.value = false;

    if(getListOrder.value) items.value = getListOrder.value

    loadingData.value = false;
  }

  const getItems = computed(() => items.value?.data)

  return {
    loadingData,
    getDataInit,
    load,
    getItems,
  };
});
