import { watch } from "vue";
import { defineStore } from "pinia";
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore'
import { useAdminImageBlockState } from "@/composables/admin/image-block/useAdminImageBlockState";
import { useAdminImageBlockOperations } from "@/composables/admin/image-block/useAdminImageBlockOperations";
import { nullRules } from "@/utils/validation";

export const useImageBlockManageStore = defineStore("ImageBlockManage", () => {
  const storeFileManage = useFileManageFolderStore();

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
    storeFileManage.handleTogglePopup(true)
  }

  watch(() => storeFileManage.getSelectImage, (newValue) => {
    if (!newValue) return
    const target = state.detailData.value?.id ? state.formUpdate : state.formItem
    target.image = newValue.url
  })

  return {
    ...state,
    ...operations,
    nullRules,
    handleAddImage,
  };
});
