import { watch } from "vue";
import { defineStore } from "pinia";
import { nullRules, nullAndSpecialRules } from '@/utils/validation'
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore'
import { useSeoWatchers } from "@/utils/seoHandle";
import { useAdminNewsCategoryState } from "@/composables/admin/news/useAdminNewsCategoryState";
import { useAdminNewsCategoryOperations } from "@/composables/admin/news/useAdminNewsCategoryOperations";

export const useCategoryManageStore = defineStore("CategoryNewsManage", () => {

  const storeFileManage = useFileManageFolderStore();

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
    const target = state.detailData.value?.id ? state.updateItem : state.formItem
    target.image = newValue.url
  })

  useSeoWatchers(state.formItem, { sourceKey: 'categoryName', autoSlug: true, autoTitleSEO: true })
  useSeoWatchers(state.updateItem, { sourceKey: 'categoryName', autoSlug: true, autoTitleSEO: true })

  return {
    ...state,
    handleAddImage,
    nullAndSpecialRules,
    nullRules,
    ...operations,
  };
});
