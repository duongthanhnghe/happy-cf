import { computed, watch } from "vue";
import { defineStore } from "pinia";
import { productsAPI } from "@/services/v1/admin/product.service";
import { useAdminProductCategoryTree } from '@/composables/admin/product/category/useAdminProductCategoryTree'
import { useFileManageFolderStore } from '@/stores/admin/file-manage/useFileManageStore'
import { useToggleActiveStatus } from "@/composables/utils/useToggleActiveStatus";
import { nullRules, nullAndSpecialRules } from '@/utils/validation'
import { useSeoWatchers } from "@/utils/seoHandle";
import { findItemInTree, markAllSelectable } from '@/utils/treeHelpers'
import { useAdminProductOperations } from "@/composables/admin/product/useAdminProductOperations";
import { useAdminProductUtils } from "@/composables/admin/product/useAdminProductUtils";
import { useAdminProductState } from "@/composables/admin/product/useAdminProductState";
import { useAdminProductImport } from "@/composables/admin/product/useAdminProductImport";

export const useProductManageStore = defineStore("ProductManage", () => {
  const { getListCategoryAllTree, fetchCategoryListTree } = useAdminProductCategoryTree()
  const storeFileManage = useFileManageFolderStore();
  
  const state = useAdminProductState()

  const treeItems = computed(() => {
    const items = getListCategoryAllTree.value ?? []
    return markAllSelectable(items)
  })

  // handles image
  const handleAddImage = () => {
    storeFileManage.handleTogglePopup(true)
  }

  const handleDeleteListImage = (id: string, formAdd: boolean) => {
    if (formAdd) {
      state.formProductItem.listImage = state.formProductItem.listImage?.filter(item => item.id !== id)
    } else {
      state.updateProductItem.listImage = state.updateProductItem.listImage?.filter(item => item.id !== id)
    }
  }

  const handleAddListImage = () => {
    state.checkSelectImage.value = false
    storeFileManage.handleTogglePopup(true)
  }

  watch(() => storeFileManage.getSelectImage, (newValue) => {
    if (!newValue) return

    const target = state.updateProductItem.id ? state.updateProductItem : state.formProductItem

    if (state.checkSelectImage.value) {
      target.image = newValue.url
    } else {
      target.listImage?.push({ id: newValue.id, src: newValue.url })
      state.checkSelectImage.value = true
    }
  })

  // SEO
  useSeoWatchers(state.formProductItem, { sourceKey: 'productName', autoSlug: true, autoTitleSEO: true })
  useSeoWatchers(state.updateProductItem, { sourceKey: 'productName', autoSlug: true, autoTitleSEO: true })

  // Tree category
  const setSelectedCategory = (parentId: string | null) => {
    if (parentId) {
      const sourceTree = state.updateProductItem.id ? treeItems.value : []
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
      if(state.updateProductItem.id) state.updateProductItem.categoryId = val[0].id;
      else state.formProductItem.categoryId = val[0].id;
      state.selectedCategoryName.value = val.map(cat => cat.categoryName);
    } else {
      state.formProductItem.categoryId = '';
      state.updateProductItem.categoryId = '';
      state.selectedCategoryName.value = [];
    }
  })

  watch(getListCategoryAllTree, (newValue) => {
    if(newValue?.length === 0 && newValue) fetchCategoryListTree()
  }, { immediate: true})

  const getListImageAdd = computed(() => state.formProductItem.listImage);

  const productUtils = useAdminProductUtils(
    state.defaultForm,
    state.formProductItem,
    state.updateProductItem,
    state.isTogglePopupAdd,
    state.isTogglePopupUpdate,
    state.isTogglePopupAddVariant,
    state.selectedCategory,
    state.selectedCategoryName,
    fetchCategoryListTree,
  )

  const productOps = useAdminProductOperations(
    state.defaultForm,
    state.formProductItem,
    state.updateProductItem,
    state.dataList,
    state.serverItems,
    state.loadingTable,
    state.totalItems,
    state.search,
    state.categorySelectedFilter,
    state.currentTableOptions,
    state.detailData,
    state.isTogglePopupAdd,
    state.isTogglePopupUpdate,
    productUtils.handleReset,
    productUtils.handleTogglePopupUpdate,
    setSelectedCategory,
  )

  const { toggleActive } = useToggleActiveStatus(productsAPI.toggleActive, state.serverItems );

  const productImport = useAdminProductImport(
    state.selectedImportFile,
    state.loadingTableImport,
    state.dataImport,
    state.serverItemsImport,
    state.totalItemsImport,
    state.isTogglePopupImport,
    state.currentTableOptions,
    state.currentTypeImport,
    productOps.loadItems,
  )

  const menuActions = computed(() => [
    {
      label: "Thêm mới",
      icon: "add",
      action: () => productUtils.handleTogglePopupAdd(true)
    },
    {
      label: "Import mới",
      icon: "upload",
      action: () => productImport.handleTogglePopupImport(true, "import")
    },
    {
      label: "Import chỉnh sửa",
      icon: "swap_vert",
      action: () => productImport.handleTogglePopupImport(true, "updateImport")
    },
    {
      label: `Export (${state.totalItems.value})`,
      icon: "download",
      action: () => productImport.handleExport()
    }
  ]);

  return {
    ...state,
    ...productUtils,
    ...productOps,
    ...productImport,
    handleDeleteListImage,
    handleAddListImage,
    handleAddImage,
    toggleActive,
    getListImageAdd,
    treeItems,
    nullRules,
    nullAndSpecialRules,
    menuActions,
  };
});
