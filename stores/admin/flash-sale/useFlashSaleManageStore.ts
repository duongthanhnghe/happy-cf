import { defineStore } from "pinia";
import { useFlashSaleManageState } from "@/composables/admin/flash-sale/useFlashSaleManageState";
import { useFlashSaleManageOperations } from "@/composables/admin/flash-sale/useFlashSaleManageOperations";
import { useFileManageFolderStore } from "../file-manage/useFileManageStore";
import { FOLDER_UPLOAD } from '@/shared/constants/folder-upload';
import { watch } from "vue";

export const useFlashSaleManageStore = defineStore(
  "FlashSaleManage",
  () => {
    const storeFileManage = useFileManageFolderStore()
    const folderName = FOLDER_UPLOAD.FLASH_SALE

    const state = useFlashSaleManageState();
    const operations = useFlashSaleManageOperations(
      state.defaultForm,
      state.formItem,
      state.updateItem,
      state.dataList,
      state.serverItems,
      state.loadingTable,
      state.totalItems,
      state.search,
      state.searchInput,
      state.fromDay,
      state.toDay,
      state.currentTableOptions,
      state.itemsPerPage,
      state.detailData,
      state.isTogglePopupAdd,
      state.isTogglePopupUpdate
    );

    const resetState = () => {
      state.isTogglePopupAdd.value = false;
      state.isTogglePopupUpdate.value = false;
      state.detailData.value = null;
    };

    const handleAddImage = () => {
      storeFileManage.handleTogglePopup(true, folderName)
    }
  
    const handleDeleteListImage = (id: string) => {
      state.formItem.banners = state.formItem.banners?.filter(item => item.id !== id)
    }
  
    const handleAddListImage = () => {
      state.checkSelectImage.value = false
      handleAddImage()
    }
  
    watch(() => storeFileManage.getSelectImage, (newValue) => {
      if (!newValue) return
  
      const target = state.isTogglePopupAdd.value ? state.formItem : state.updateItem
        if (state.checkSelectImage.value) {
          target.badgeImage = newValue.url
        } else {
          target.banners?.push({ id: newValue.id, src: newValue.url })
          state.checkSelectImage.value = true
        }
    })

    return {
      ...state,
      folderName,
      ...operations,
      resetState,
      handleAddImage,
      handleDeleteListImage,
      handleAddListImage,
    };
  }
);