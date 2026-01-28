import { defineStore } from "pinia";
import { FOLDER_UPLOAD } from "@/shared/constants/folder-upload";
import { useAdminITranslationState } from "@/composables/admin/itranslation/useAdminITranslationState";
import { useAdminITranslationOperations } from "@/composables/admin/itranslation/useAdminITranslationOperations";

export const useTranslationManageStore = defineStore("TranslationManageStore", () => {

  const folderName = FOLDER_UPLOAD.DEFAULT
  const state = useAdminITranslationState()
  const operations = useAdminITranslationOperations(
    state.defaultForm,
    state.formItem,
    state.updateItem,
    state.dataList,
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

  return {
    ...state,
    folderName,
    ...operations,
  };
});
