import { showWarning, showConfirm, showSuccess } from "@/utils/toast";
import type { CategoryProductDTO, CreateCategoryProductDTO, UpdateCategoryProductDTO } from '@/server/types/dto/v1/product.dto';
import { computed, toValue, unref, watch, type Ref } from 'vue';
import type { TableOpt } from "@/server/types";
import { useAdminProductCategory } from "@/composables/admin/product/category/useAdminProductCategory";
import { Loading } from "@/utils/global";
import { categoriesAPI } from "@/services/v1/admin/categories-product.service";
import { useAdminProductCategoryDetail } from "@/composables/admin/product/category/useAdminProductCategoryDetail";
type MaybeRef<T> = T | Ref<T>;
export const useAdminProductCategoryOperations = (
  formCategoryItem: MaybeRef<CreateCategoryProductDTO>,
  updateCategoryItem: MaybeRef<UpdateCategoryProductDTO>,
  dataListCategory: Ref<CategoryProductDTO[] | null>,
  maxOrder: Ref<Number>,
  serverItems: Ref<CategoryProductDTO[]>,
  loadingTable: Ref<Boolean>,
  totalItems: Ref<Number>,
  search: Ref<string>,
  currentTableOptions: Ref<TableOpt>,
  isTogglePopupAdd: Ref<boolean>,
  isTogglePopupUpdate: Ref<boolean>,
  itemsPerPage: number,
  handleResetFormCategoryItem: () => void,
  handleTogglePopupUpdate: (value: boolean) => void,
  setSelectedCategory: (parentId: string | null) => void,
) => {
  const { getListCategoryAll, fetchCategoryList } = useAdminProductCategory()
  const { getProductCategoryDetail, fetchProductCategoryDetail } = useAdminProductCategoryDetail()

  const getListAllCategory = async () => {
    await fetchCategoryList(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage,search.value)
    
    if(!getListCategoryAll.value) return
    dataListCategory.value = getListCategoryAll.value.data
    totalItems.value = getListCategoryAll.value.pagination.total
    currentTableOptions.value.page = getListCategoryAll.value.pagination.page
    currentTableOptions.value.itemsPerPage = getListCategoryAll.value.pagination.limit
  
  }

  const ListAllCategoryApi = {
    async fetch({ items}: {
      items: CategoryProductDTO[],
    }) {
      return new Promise(resolve => {
        setTimeout(() => {
          let filtered = items.slice()

          resolve({ items: filtered })
        }, 200)
      })
    },
  }
  
  async function loadItemsCategory( opt: TableOpt ) {
    loadingTable.value = true;

    await getListAllCategory();

    const {items} = await ListAllCategoryApi.fetch({
      items: dataListCategory.value || [],
    }) as { items: CategoryProductDTO[] }
      
    serverItems.value = items
    if(getListCategoryAll.value) totalItems.value = getListCategoryAll.value.pagination.total
    loadingTable.value = false;
  }

  watch(
    async () => [search.value, currentTableOptions.value.page, currentTableOptions.value.itemsPerPage],
    async () => {
      await loadItemsCategory(currentTableOptions.value);
      if(getListCategoryAll.value) {
        maxOrder.value = getListCategoryAll.value.pagination.total
      } else {
        maxOrder.value = 0
      }
    }
  );

  async function submitCreate() {
    Loading(true);
    try {
      const newCategory = toValue(formCategoryItem);
      const data = await categoriesAPI.create(newCategory)
      if(data.code === 0) {
        showSuccess(data.message)
        isTogglePopupAdd.value = false;
        handleResetFormCategoryItem()
        await loadItemsCategory(currentTableOptions.value);
      } else showWarning(data.message)
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const handleEditCategory = async (id: string) => {
    if(!id) return
    await fetchProductCategoryDetail(id)
    if(!getProductCategoryDetail.value) return
    handleTogglePopupUpdate(true);
    Object.assign(updateCategoryItem, getProductCategoryDetail.value);
    const realUpdateItem = unref(updateCategoryItem);

    if (realUpdateItem.parentId) {
      setSelectedCategory(realUpdateItem.parentId);
    }
    // if(updateCategoryItem.parentId) setSelectedCategory(updateCategoryItem.parentId)
  }

  async function submitUpdate() {
    Loading(true);
    try {
      const newCategory = toValue(updateCategoryItem);
      
      const data = await categoriesAPI.update(newCategory.id, newCategory)
      if(data.code === 0){
        showSuccess(data.message)
        isTogglePopupUpdate.value = false;
        handleResetFormCategoryItem()
        await loadItemsCategory(currentTableOptions.value);
      } else showWarning(data.message)
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const handleDeleteCategory = async (id: string) => {
    const confirmed = await showConfirm('Bạn có chắc xoá?')
    if (!confirmed) return

    Loading(true);
    try {
      const data = await categoriesAPI.delete(id)
      if(data.code === 1) showWarning(data.message)
      else {
        await loadItemsCategory(currentTableOptions.value);
        showSuccess(data.message)
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const resetFilter = () => {
    search.value = ''
    currentTableOptions.value.page = 1
    currentTableOptions.value.itemsPerPage = itemsPerPage
  }

  const hasFilter = computed(() => {
    return (
      search.value !== '' ||
      currentTableOptions.value.page !== 1 ||
      currentTableOptions.value.itemsPerPage !== itemsPerPage
    )
  })

  return {
    getListAllCategory,
    handleEditCategory,
    handleDeleteCategory,
    loadItemsCategory,
    submitCreate,
    submitUpdate,
    resetFilter,
    hasFilter,
  };
};