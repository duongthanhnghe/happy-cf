import { defineStore } from "pinia";
import { useMembershipOperations } from "@/composables/admin/user/useMembershipOperations";
import { useMembershipState } from "@/composables/admin/user/useMembershipState";

export const useMembershipStore = defineStore("MembershipStore", () => {

  const state = useMembershipState()

  const operation = useMembershipOperations(
    state.dataList,
    state.serverItems,
    state.loadingTable,
    state.totalItems,
    state.defaultForm,
    state.formItem,
    state.selectedArray,
    state.isTogglePopupUpdate,
    state.detailData,
  )
  
  return {
    ...state,
    ...operation,
  };
});
