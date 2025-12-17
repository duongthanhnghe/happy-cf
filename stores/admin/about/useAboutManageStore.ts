import { watch } from "vue";
import { defineStore } from "pinia";
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore'
import { useFileSelectContextStore } from "@/stores/admin/file-manage/useFileSelectContextStore"
import { FOLDER_UPLOAD } from '@/shared/constants/folder-upload';
import { nullRules } from "@/utils/validation";
import { useAdminAboutState } from "@/composables/admin/about/useAdminAboutState";
import { useAdminAboutOperations } from "@/composables/admin/about/useAdminAboutOperations";

export const useAboutManageStore = defineStore("AboutManage", () => {
  const storeFileManage = useFileManageFolderStore()
  const contextStore = useFileSelectContextStore()

  const folderName = FOLDER_UPLOAD.ABOUT
  const state = useAdminAboutState()

  const operations = useAdminAboutOperations(
    state.defaultForm,
    state.formItem,
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
    contextStore.setContext("about")
    storeFileManage.handleTogglePopup(true)
  }

  const handleDeleteListImage = (id: string) => {
    state.formItem.listImage = state.formItem.listImage?.filter(item => item.id !== id)
  }

  const handleAddListImage = () => {
    contextStore.setContext("about")
    state.checkSelectImage.value = false
    storeFileManage.handleTogglePopup(true)
  }

  watch(() => storeFileManage.getSelectImage, (newValue) => {
    if (!newValue) return

    const target = state.formItem
    if (contextStore.context?.includes("about")) {
      if (state.checkSelectImage.value) {
        target.image = newValue.url
      } else {
        target.listImage?.push({ id: newValue.id, src: newValue.url })
        state.checkSelectImage.value = true
      }
      contextStore.setContext(null)
    }
  })

  return {
    ...state,
    folderName,
    ...operations,
    handleAddImage,
    handleDeleteListImage,
    handleAddListImage,
    nullRules,
  };
});
