import { defineStore } from "pinia";
import { useUserManageOperations } from "@/composables/admin/user/useUserManageOperations";
import { useUserManageState } from "@/composables/admin/user/useUserManageState";

export const useUserManageStore = defineStore("UserManage", () => {

  const state = useUserManageState()

  const userOperation = useUserManageOperations(
    state.dataList,
    state.serverItems,
    state.loadingTable,
    state.totalItems,
    state.search,
    state.currentTableOptions,
    state.filterTypeMember,
  )

  return {
    ...state,
    ...userOperation,
  };
});
