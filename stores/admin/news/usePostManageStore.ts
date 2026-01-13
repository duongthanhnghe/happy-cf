import { watch } from "vue";
import { defineStore } from "pinia";
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore'
import { useFileSelectContextStore } from "@/stores/admin/file-manage/useFileSelectContextStore"
import { FOLDER_UPLOAD } from "@/shared/constants/folder-upload";
import { useSeoWatchers } from "@/utils/seoHandle";
import { useAdminPostNewsState } from "@/composables/admin/news/useAdminPostNewsState";
import { useAdminPostNewsOperations } from "@/composables/admin/news/useAdminPostNewsOperations";

export const usePostManageStore = defineStore("PostManage", () => {

  const storeFileManage = useFileManageFolderStore()
  const contextStore = useFileSelectContextStore()

  const folderName = FOLDER_UPLOAD.POST
  const state = useAdminPostNewsState()

  const operations = useAdminPostNewsOperations(
    state.defaultForm,
    state.formPostItem,
    state.updatePostItem,
    state.dataList,
    state.serverItems,
    state.loadingTable,
    state.totalItems,
    state.search,
    state.currentTableOptions,
    state.isTogglePopupAdd,
    state.isTogglePopupUpdate,
    state.detailData,
    state.filterCategory,
  )

  useSeoWatchers(state.formPostItem, { sourceKey: 'title', autoSlug: true, autoTitleSEO: true })
  useSeoWatchers(state.updatePostItem, { sourceKey: 'title', autoSlug: true, autoTitleSEO: true })

  const handleAddImage = () => {
    contextStore.setContext("post")
    storeFileManage.handleTogglePopup(true)
  }

  watch(() => storeFileManage.getSelectImage, (newValue) => {
    if (!newValue) return
    if (contextStore.context?.includes("post")) {
      const target = state.detailData.value?.id ? state.updatePostItem : state.formPostItem
      target.image = newValue.url
    }
  })

  return {
    ...state,
    folderName,
    ...operations,
    handleAddImage,
  };
});
