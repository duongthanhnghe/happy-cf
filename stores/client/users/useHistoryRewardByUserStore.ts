import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useHistoryRewardByUser } from "@/composables/user/useHistoryRewardByUser";
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import type { RewardHistoryPaginationDTO } from "@/server/types/dto/reward-history.dto";

export const useHistoryRewardByUserStore = defineStore("HistoryRewardByUserStore", () => {

  const { getListOrder, fetchListOrder } = useHistoryRewardByUser()
  const storeAccount = useAccountStore();

  const isTogglePopup = ref<boolean>(false);
  const limit = 20
  const items = ref<RewardHistoryPaginationDTO|null>(null)

  const handleTogglePopup = (value: boolean) => {
    isTogglePopup.value = value;
    if(!getListOrder.value) getApiListProduct()
  };

  async function load({ done }: { done: (status: 'ok' | 'empty') => void }) {
    if(!items.value) return
    try {
      const currentPage = items.value.pagination.page
      const totalPages = items.value.pagination.totalPages

      if (currentPage >= totalPages) {
        done('empty')
        return
      }

      const nextPage = currentPage + 1
      await fetchListOrder(storeAccount.getDetailValue?.id,nextPage, limit)

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

  const getApiListProduct = async () => {
    await fetchListOrder(storeAccount.getDetailValue?.id, 1, limit)
    if(getListOrder.value) items.value = getListOrder.value
  }

  //getters
  const getItems = computed(() => items.value?.data)

  return {
    // state
    items,
    isTogglePopup,
    // actions
    handleTogglePopup,
    getApiListProduct,
    load,
    //getters
    getItems,
  };
});
