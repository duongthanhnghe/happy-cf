import { computed } from "vue";
import { defineStore } from "pinia";
import { usePaymentTransactionManageOperations } from "@/composables/admin/payment-transaction/usePaymentTransactionManageOperations";
import { usePaymentTransactionManageState } from "@/composables/admin/payment-transaction/usePaymentTransactionManageState";

export const usePaymentTransactionManageStore = defineStore("PaymentTransactionManageStore", () => {

  const state = usePaymentTransactionManageState()

  const orderOperation = usePaymentTransactionManageOperations(
    state.dataList,
    state.serverItems,
    state.loadingTable,
    state.totalItems,
    state.search,
    state.fromDay,
    state.toDay,
    state.currentTableOptions,
    state.filterStatus,
    state.filterPaymentMethod,
    state.togglePopupDetail,
  )

  const hasFilter = computed(() => {
    return (
      state.search.value !== '' ||
      state.fromDay.value !== '' ||
      state.toDay.value !== '' ||
      state.filterStatus.value !== '' ||
      state.filterPaymentMethod.value !== '' ||
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