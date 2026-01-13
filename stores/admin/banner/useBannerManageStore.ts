import { watch } from "vue";
import { defineStore } from "pinia";
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore'
import { useAdminBannerState } from "@/composables/admin/banner/useAdminBannerState";
import { useAdminBannerOperations } from "@/composables/admin/banner/useAdminBannerOperations";
import { FOLDER_UPLOAD } from "@/shared/constants/folder-upload";

export const useBannerManageStore = defineStore("BannerManage", () => {
  const storeFileManage = useFileManageFolderStore();

  const folderName = FOLDER_UPLOAD.BANNER
  const state = useAdminBannerState()
  const operations = useAdminBannerOperations(
    state.defaultForm,
    state.formBannerItem,
    state.serverItems,
    state.loadingTable,
    state.isTogglePopupAdd,
    state.isTogglePopupUpdate,
    state.detailData,
  )

  const handleAddImage = () => {
    storeFileManage.handleTogglePopup(true, folderName)
  }

  watch(() => storeFileManage.getSelectImage, (newValue) => {
    if (!newValue) return
    const target = state.formBannerItem
    target.image = newValue.url
  })

  return {
    ...state,
    ...operations,
    folderName,
    handleAddImage,
  };
});
