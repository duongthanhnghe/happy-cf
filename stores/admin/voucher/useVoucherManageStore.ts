import { watch } from "vue";
import { defineStore } from "pinia";
import { nullRules, nullAndSpecialRules } from '@/utils/validation';
import { useVoucherUtils } from "@/composables/shared/voucher/useVoucherUtils";
import { useFileManageFolderStore } from "../file-manage/useFileManageStore";
import { useVoucherManageState } from "@/composables/admin/voucher/useVoucherManageState";
import { useVoucherManageOperations } from "@/composables/admin/voucher/useVoucherManageOperations";
import { FOLDER_UPLOAD } from "@/shared/constants/folder-upload";

export const useVoucherManageStore = defineStore("VoucherManage", () => {

  const { isDiscountVoucherType } = useVoucherUtils()
  const storeFileManage = useFileManageFolderStore();

  const folderName = FOLDER_UPLOAD.VOUCHER
  const state = useVoucherManageState()
  const operations = useVoucherManageOperations(
    state.defaultForm,
    state.formItem,
    state.updateItem,
    state.dataList,
    state.serverItems,
    state.loadingTable,
    state.totalItems,
    state.search,
    state.fromDay,
    state.toDay,
    state.currentTableOptions,
    state.filterType,
    state.itemsPerPage,
    state.detailData,
    state.isTogglePopupAdd,
    state.isTogglePopupUpdate,
    state.checkEdit,
    state.selectedCategory,
    state.selectedCategoryName,
  )

  const handleAddImage = () => {
    storeFileManage.handleTogglePopup(true, folderName);
  }

  watch(() => storeFileManage.getSelectImage, (newValue) => {
    if (!newValue) return
    const target = state.detailData.value?.id ? state.updateItem : state.formItem
    target.image = newValue.url
  })

  const resetState = () => {
    state.selectedCategory.value = []
    state.selectedCategoryName.value = []

    state.isTogglePopupAdd.value = false
    state.isTogglePopupUpdate.value = false

    state.detailData.value = null
  }

  return {
    ...state,
    nullRules,
    nullAndSpecialRules,
    isDiscountVoucherType,
    handleAddImage,
    resetState,
    ...operations,
    folderName,
  };
});
