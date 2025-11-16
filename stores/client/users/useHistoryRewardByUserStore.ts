import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { useHistoryRewardUtils } from "@/composables/user/useHistoryRewardUtils";
import type { RewardHistoryPaginationDTO } from "@/server/types/dto/v1/reward-history.dto";

export const useHistoryRewardByUserStore = defineStore("HistoryRewardByUserStore", () => {

  const storeAccount = useAccountStore();

  const limit = 20
  const items = ref<RewardHistoryPaginationDTO|null>(null)
  const isTogglePopup = ref(false)

  const utils = useHistoryRewardUtils(
    limit,
    items,
    isTogglePopup,
    storeAccount.getUserId,
  );
  
  const getItems = computed(() => items.value?.data)

  return {
    isTogglePopup,
    ...utils,
    getItems,
  };
});
