import { watch } from "vue";
import { defineStore } from "pinia";
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore'
import { useSeoWatchers } from "@/utils/seoHandle";
import { useAdminNewsCategoryState } from "@/composables/admin/news/useAdminNewsCategoryState";
import { useAdminNewsCategoryOperations } from "@/composables/admin/news/useAdminNewsCategoryOperations";
import { FOLDER_UPLOAD } from "@/shared/constants/folder-upload";

export const useCategoryManageStore = defineStore("CategoryNewsManage", () => {

  const storeFileManage = useFileManageFolderStore();

  const folderName = FOLDER_UPLOAD.CATEGORY_NEWS
  const state = useAdminNewsCategoryState()
  const operations = useAdminNewsCategoryOperations(
    state.defaultForm,
    state.formItem,
    state.updateItem,
    state.dataList,
    state.maxOrder,
    state.serverItems,
    state.loadingTable,
    state.totalItems,
    state.search,
    state.searchInput,
    state.currentTableOptions,
    state.isTogglePopupAdd,
    state.isTogglePopupUpdate,
    state.detailData,
  )

  const handleAddImage = () => {
    storeFileManage.handleTogglePopup(true, folderName)
  }

  watch(() => storeFileManage.getSelectImage, (newValue) => {
    if (!newValue) return
    const target = state.detailData.value?.id ? state.updateItem : state.formItem
    target.image = newValue.url
  })

  useSeoWatchers(state.formItem, { sourceKey: 'categoryName', autoSlug: true, autoTitleSEO: true })
  useSeoWatchers(state.updateItem, { sourceKey: 'categoryName', autoSlug: true, autoTitleSEO: true })

  return {
    ...state,
    handleAddImage,
    ...operations,
    folderName,
  };
});
