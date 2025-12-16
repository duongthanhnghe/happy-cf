import { defineStore } from "pinia";
import { useRewardHistoryOperations } from "@/composables/admin/user/reward-history/useRewardHistoryOperations";
import { useRewardHistoryState } from "@/composables/admin/user/reward-history/useRewardHistoryState";

export const useRewardHistoryStore = defineStore("RewardHistoryAdmin", () => {

  const state = useRewardHistoryState()

  const operations = useRewardHistoryOperations(
    state.dataList,
    state.serverItems,
    state.loadingTable,
    state.totalItems,
    state.search,
    state.fromDay,
    state.toDay,
    state.currentTableOptions,
    state.filterTypeReward,
  )
  
  return {
    ...state,
    ...operations,
  };
});
