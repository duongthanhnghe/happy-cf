import { defineStore } from "pinia";
import { useAdminAccountManageState } from "@/composables/admin/account/useAdminAccountManageState";
import { useAdminAccountManageOperations } from "@/composables/admin/account/useAdminAccountManageOperations";

export const useAccountListStore = defineStore("AccountListStore", () => {

  const state = useAdminAccountManageState()
  const operations = useAdminAccountManageOperations(
    state.defaultForm,
    state.formCreate,
    state.dataList,
    state.serverItems,
    state.loadingTable,
    state.totalItems,
    state.search,
    state.searchInput,
    state.filterTypeMember,
    state.currentTableOptions,
    state.newPassword,
    state.isTogglePopupCreate,
  )

  return {
    ...state,
    ...operations,
  };
});
