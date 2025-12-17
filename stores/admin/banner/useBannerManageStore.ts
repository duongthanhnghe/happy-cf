import { watch } from "vue";
import { defineStore } from "pinia";
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore'
import { useAdminBannerState } from "@/composables/admin/banner/useAdminBannerState";
import { useAdminBannerOperations } from "@/composables/admin/banner/useAdminBannerOperations";
import { nullRules } from "@/utils/validation";

export const useBannerManageStore = defineStore("BannerManage", () => {
  const storeFileManage = useFileManageFolderStore();

  const state = useAdminBannerState()
  const operations = useAdminBannerOperations(
    state.defaultForm,
    state.formBannerItem,
    state.dataList,
    state.serverItems,
    state.loadingTable,
    state.totalItems,
    state.currentTableOptions,
    state.isTogglePopupAdd,
    state.isTogglePopupUpdate,
    state.detailData,
  )

  const handleAddImage = () => {
    storeFileManage.handleTogglePopup(true)
  }

  watch(() => storeFileManage.getSelectImage, (newValue) => {
    if (!newValue) return
    const target = state.formBannerItem
    target.image = newValue.url
  })

  return {
    ...state,
    ...operations,
    nullRules,
    handleAddImage,
  };
});
