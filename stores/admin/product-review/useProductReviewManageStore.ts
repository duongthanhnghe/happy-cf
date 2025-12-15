import { computed } from "vue";
import { defineStore } from "pinia";
import { useProductReviewManageOperations } from '@/composables/admin/product/review/useProductReviewManageOperations';
import { useProductReviewManageState } from '@/composables/admin/product/review/useProductReviewManageState';

export const useProductReviewManageStore = defineStore("ProductReviewManageStore", () => {

  const state = useProductReviewManageState()

  const reviewOperation = useProductReviewManageOperations(
    state.dataList,
    state.serverItems,
    state.loadingTable,
    state.totalItems,
    state.search,
    state.fromDay,
    state.toDay,
    state.currentTableOptions,
    state.filterStatusOrder,
    state.filterNumberStar,
    state.isTogglePopupAdd,
  )

  const hasFilter = computed(() => {
    return (
      state.search.value !== '' ||
      state.fromDay.value !== '' ||
      state.toDay.value !== '' ||
      state.filterStatusOrder.value !== null ||
      state.filterNumberStar.value !== null ||
      state.currentTableOptions.value.page !== 1 ||
      state.currentTableOptions.value.itemsPerPage !== 20
    )
  })

  return {
    ...state,
    ...reviewOperation,
    hasFilter,
  };
});