import { defineStore } from "pinia";
import { usePromotionGiftUsageOperations } from "@/composables/admin/promotion-gift/usePromotionGiftUsageOperations";
import { usePromotionGiftUsageState } from "@/composables/admin/promotion-gift/usePromotionGiftUsageState";

export const usePromotionGiftUsageManageStore = defineStore(
  "PromotionGiftUsageManage",
  () => {
    const state = usePromotionGiftUsageState();

    const operations = usePromotionGiftUsageOperations(
      state.dataList,
      state.serverItems,
      state.loadingTable,
      state.totalItems,
      state.search,
      state.searchInput,
      state.fromDay,
      state.toDay,
      state.reverted,
      state.currentTableOptions,
      state.itemsPerPage,
    );

    return {
      ...state,
      ...operations,
    };
  }
);
