import { watch, computed } from "vue";
import { defineStore } from "pinia";
import { categoriesAPI } from "@/services/v1/admin/categories-product.service";
import { useAdminProductCategoryTree } from '@/composables/admin/product/category/useAdminProductCategoryTree'
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore'
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";
import { useChangeOrder } from "@/composables/utils/useChangeOrder";
import { useSeoWatchers } from "@/utils/seoHandle";
import { findItemInTree, markAllSelectable } from '@/utils/treeHelpers'
import { useAdminProductCategoryOperations } from "@/composables/admin/product/category/useAdminProductCategoryOperations";
import { useAdminProductCategoryUtils } from "@/composables/admin/product/category/useAdminProductCategoryUtils";
import { useAdminProductCategoryState } from "@/composables/admin/product/category/useAdminProductCategoryState";
import { FOLDER_UPLOAD } from "@/shared/constants/folder-upload";

export const useCategoryManageStore = defineStore("CategoryManage", () => {

  const { getListCategoryAllTree, fetchCategoryListTree } = useAdminProductCategoryTree()
  const storeFileManage = useFileManageFolderStore();

  const folderName = FOLDER_UPLOAD.CATEGORY_PRODUCT
  const state = useAdminProductCategoryState();

  const treeItems = computed(() => {
    const items = getListCategoryAllTree.value ?? []
    return markAllSelectable(items)
  })
  const treeItemsForEdit = computed(() => {
    const items = getListCategoryAllTree.value ?? []
    return markAllSelectable(items, state.updateCategoryItem.id)
  })
  
  const getListOrder = computed(() => {
    return Array.from({ length: state.maxOrder.value }, (_, i) => i + 1)
  })

  //upload image
  const handleAddImage = (type: 'image' | 'banner') => {
    state.currentImageType.value = type;
    storeFileManage.handleTogglePopup(true, folderName);
  }

  watch(() => storeFileManage.getSelectImage, (newValue) => {
    if (!newValue) return

    const target = state.updateCategoryItem.id ? state.updateCategoryItem : state.formCategoryItem

    if (state.currentImageType.value === 'image') {
      target.image = newValue.url
    } else if (state.currentImageType.value === 'banner') {
      target.banner = newValue.url
    }

    state.currentImageType.value = null
  })

  // SEO
  useSeoWatchers(state.formCategoryItem, { sourceKey: 'categoryName', autoSlug: true, autoTitleSEO: true })
  useSeoWatchers(state.updateCategoryItem, { sourceKey: 'categoryName', autoSlug: true, autoTitleSEO: true })

  // Tree category
  const setSelectedCategory = (parentId: string | null) => {
    if (parentId) {
      const sourceTree = state.updateCategoryItem.id ? treeItemsForEdit.value : treeItems.value
      const parentCategory = findItemInTree(sourceTree, parentId)
      if (parentCategory) {
        state.selectedCategory.value = [parentCategory]
        state.selectedCategoryName.value = [parentCategory.categoryName]
      }
    } else {
      state.selectedCategory.value = []
      state.selectedCategoryName.value = []
    }
  }

  watch(state.selectedCategory, (val) => {
    if (val.length > 0) {
      if(state.updateCategoryItem.id) state.updateCategoryItem.parentId = val[0].id;
      else state.formCategoryItem.parentId = val[0].id;
      state.selectedCategoryName.value = val.map(cat => cat.categoryName);
    } else {
      state.formCategoryItem.parentId = null;
      state.updateCategoryItem.parentId = null;
      state.selectedCategoryName.value = [];
    }
  })

  watch(getListCategoryAllTree, (newValue) => {
    if(newValue?.length === 0 && newValue) fetchCategoryListTree()
  }, { immediate: true})

  const productUtils = useAdminProductCategoryUtils(
    state.defaultForm,
    state.formCategoryItem,
    state.updateCategoryItem,
    state.isTogglePopupAdd,
    state.isTogglePopupUpdate,
    state.selectedCategory,
    state.selectedCategoryName,
    fetchCategoryListTree,
  )

  const productOps = useAdminProductCategoryOperations(
    state.formCategoryItem,
    state.updateCategoryItem,
    state.dataListCategory,
    state.maxOrder,
    state.serverItems,
    state.loadingTable,
    state.totalItems,
    state.search,
    state.currentTableOptions,
    state.isTogglePopupAdd,
    state.isTogglePopupUpdate,
    state.itemsPerPage,
    productUtils.handleResetFormCategoryItem,
    productUtils.handleTogglePopupUpdate,
    setSelectedCategory,
  );

  const { toggleActive } = useToggleActiveStatus(categoriesAPI.toggleActive, state.serverItems );

  const { handleChangeOrder } = useChangeOrder(categoriesAPI.updateOrder, () => productOps.loadItemsCategory(state.currentTableOptions.value));

  return {
    ...state,
    ...productUtils,
    ...productOps,
    handleAddImage,
    toggleActive,
    handleChangeOrder,
    getListOrder,
    getListCategoryAllTree,
    treeItems,
    treeItemsForEdit,
    folderName
  };
});
