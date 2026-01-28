import { defineStore } from "pinia";
import { useVoucherUsageOperations } from "@/composables/admin/voucher/useVoucherUsageOperations";
import { useVoucherUsageState } from "@/composables/admin/voucher/useVoucherUsageState";

export const useVoucherUsageManageStore = defineStore("VoucherUsageManage", () => {

  const state = useVoucherUsageState()
  const operations = useVoucherUsageOperations(
    state.dataList,
    state.serverItems,
    state.loadingTable,
    state.totalItems,
    state.search,
    state.searchInput,
    state.fromDay,
    state.toDay,
    state.currentTableOptions,
    state.filterType,
    state.itemsPerPage,
  )
  
  return {
    ...state,
    ...operations,
  };
});
