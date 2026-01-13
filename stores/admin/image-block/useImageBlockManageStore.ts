import { watch } from "vue";
import { defineStore } from "pinia";
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore'
import { useAdminImageBlockState } from "@/composables/admin/image-block/useAdminImageBlockState";
import { useAdminImageBlockOperations } from "@/composables/admin/image-block/useAdminImageBlockOperations";
import { FOLDER_UPLOAD } from "@/shared/constants/folder-upload";

export const useImageBlockManageStore = defineStore("ImageBlockManage", () => {
  const storeFileManage = useFileManageFolderStore();

  const folderName = FOLDER_UPLOAD.IMAGE_BLOCK
  const state = useAdminImageBlockState()
  const operations = useAdminImageBlockOperations(
    state.defaultForm,
    state.formItem,
    state.formUpdate,
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
    const target = state.detailData.value?.id ? state.formUpdate : state.formItem
    target.image = newValue.url
  })

  return {
    ...state,
    ...operations,
    folderName,
    handleAddImage,
  };
});
