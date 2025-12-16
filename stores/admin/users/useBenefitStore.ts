import { defineStore } from "pinia";
import { useMembershipBenefitOperations } from "@/composables/admin/user/useMembershipBenefitOperations";
import { useMembershipBenefitState } from "@/composables/admin/user/useMembershipBenefitState";

export const useBenefitStore = defineStore("BenefitStore", () => {

  const state = useMembershipBenefitState()
  const operations = useMembershipBenefitOperations(
    state.dataList,
    state.serverItems,
    state.loadingTable,
    state.totalItems,
    state.defaultForm,
    state.formItem,
    state.updateItem,
    state.isTogglePopupAdd,
    state.isTogglePopupUpdate,
    state.detailData,
  )

  return {
    ...state,
    ...operations,
  };
});
