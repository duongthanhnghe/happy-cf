import { computed } from "vue";
import { defineStore } from "pinia";
import { useOrderOperations } from '@/composables/admin/order/useOrderManageOperations';
import { useOrderManageState } from '@/composables/admin/order/useOrderManageState';

export const useOrderManageStore = defineStore("OrderManage", () => {

  const state = useOrderManageState()

  const orderOperation = useOrderOperations(
    state.dataListOrder,
    state.serverItems,
    state.loadingTable,
    state.totalItems,
    state.search,
    state.fromDay,
    state.toDay,
    state.currentTableOptions,
    state.filterStatusOrder,
    state.filterStatusTransactionOrder,
    state.isTogglePopupAdd,
  )

  const hasFilter = computed(() => {
    return (
      state.search.value !== '' ||
      state.fromDay.value !== '' ||
      state.toDay.value !== '' ||
      state.filterStatusOrder.value !== '' ||
      state.filterStatusTransactionOrder.value !== '' ||
      state.currentTableOptions.value.page !== 1 ||
      state.currentTableOptions.value.itemsPerPage !== 20
    )
  })

  return {
    ...state,
    ...orderOperation,
    hasFilter,
  };
});