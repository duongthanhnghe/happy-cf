import { computed } from "vue";
import { defineStore } from "pinia";
import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { useLocationStore } from '@/stores/shared/useLocationStore';
import { useAddressesState } from "@/composables/user/useAddressesState";
import { useAddressesUtils } from "@/composables/user/useAddressesUtils";
import { useAddressesOperations } from "@/composables/user/useAddressesOperations";

export const useAddressesManageStore = defineStore("AddressesManage", () => {
  const storeAccount = useAccountStore();
  const storeLocation = useLocationStore();

  const state = useAddressesState();

  const utils = useAddressesUtils(
    state.defaultForm,
    state.formDataItem,
    state.dataList,
    state.detailData,
    state.isTogglePopupList,
    state.isTogglePopupUpdate,
    state.isTogglePopupAdd,
    state.isChildrenPopupManage,
    state.actionChangeAddress,
    state.loadingData,
    storeAccount.getUserId,
    storeLocation
  );

  const operations = useAddressesOperations(
    state.formDataItem,
    state.dataList,
    state.detailData,
    state.isTogglePopupUpdate,
    state.isTogglePopupAdd,
    storeAccount.getUserId,
    storeLocation,
    utils.loadItems,
    utils.handleResetForm,
  );

  const getListAddress = computed(() => state.dataList.value);
  const getActionChangeAddress = computed(() => state.actionChangeAddress.value);

  return {
    ...state,
    ...utils,
    ...operations,
    getListAddress,
    getActionChangeAddress,
  }
});