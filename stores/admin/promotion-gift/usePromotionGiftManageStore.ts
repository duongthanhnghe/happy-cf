import { defineStore } from "pinia";
import { usePromotionGiftManageState } from "@/composables/admin/promotion-gift/usePromotionGiftManageState";
import { usePromotionGiftManageOperations } from "@/composables/admin/promotion-gift/usePromotionGiftManageOperations";

export const usePromotionGiftManageStore = defineStore("PromotionGiftManageStore", () => {
  const state = usePromotionGiftManageState()

  const operations = usePromotionGiftManageOperations(
    state.defaultForm,
    state.formItem,
    state.updateItem,
    state.dataList,
    state.serverItems,
    state.loadingTable,
    state.totalItems,
    state.currentTableOptions,
    state.detailData,
    state.isTogglePopupAdd,
    state.isTogglePopupUpdate,
    state.selectedCategory,
    state.selectedCategoryName,
    state.search,
    state.searchInput,
    state.fromDay,
    state.toDay,
    state.itemsPerPage,
  )

  const resetState = () => {
    state.selectedCategory.value = []
    state.selectedCategoryName.value = []

    state.isTogglePopupAdd.value = false
    state.isTogglePopupUpdate.value = false

    state.detailData.value = null
  }

  return {
    ...state,
    ...operations,
    resetState,
  };
});
