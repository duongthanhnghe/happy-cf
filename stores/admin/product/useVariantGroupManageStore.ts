import { defineStore } from "pinia";
import { variantGroupAPI } from "@/services/v1/admin/variant-group.service";
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";
import { useAdminVariantGroupOperations } from "@/composables/admin/product/variant-group/useAdminVariantGroupOperations";
import { useAdminVariantGroupState } from "@/composables/admin/product/variant-group/useAdminVariantGroupState";

export const useVariantGroupStore = defineStore("VariantGroupManage", () => {

  const state = useAdminVariantGroupState()

  const variantOperation = useAdminVariantGroupOperations(
    state.defaultForm,
    state.formItem,
    state.updateItem,
    state.dataList,
    state.serverItems,
    state.loadingTable,
    state.totalItems,
    state.search,
    state.isTogglePopupAdd,
    state.isTogglePopupUpdate,
    state.currentTableOptions,
    state.detailData,
  )

  const { toggleActive } = useToggleActiveStatus(variantGroupAPI.toggleActive, state.serverItems );

  return {
   ...state,
   ...variantOperation,
   toggleActive,
  };
});
