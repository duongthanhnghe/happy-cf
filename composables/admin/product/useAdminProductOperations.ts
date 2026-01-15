import { showWarning, showConfirm, showSuccess } from "@/utils/toast";
import type { CreateProductDTO, ProductDTO, UpdateProductDTO } from '@/server/types/dto/v1/product.dto';
import { computed, unref, watch, type Ref } from 'vue';
import type { TableOpt } from "@/server/types";
import { generateSkuProduct, Loading } from "@/utils/global";
import { useAdminProductAll } from "./useAdminProductAll";
import { useAdminProductDetail } from "./useAdminProductDetail";
import { productsAPI } from "@/services/v1/admin/product.service";
type MaybeRef<T> = T | Ref<T>;

export const useAdminProductOperations = (
  defaultForm: object,
  formProductItem: MaybeRef<CreateProductDTO>,
  updateProductItem: MaybeRef<UpdateProductDTO>,
  dataList: Ref<ProductDTO[] | null>,
  serverItems: Ref<ProductDTO[]>,
  loadingTable: Ref<Boolean>,
  totalItems: Ref<Number>,
  search: Ref<string>,
  categorySelectedFilter: Ref<string>,
  currentTableOptions: Ref<TableOpt>,
  detailData: Ref<ProductDTO|null>,
  isTogglePopupAdd: Ref<boolean>,
  isTogglePopupUpdate: Ref<boolean>,
  selectedIdsDelete: Ref<string[]>,
  itemsPerPage: number,
  handleReset: () => void,
  handleTogglePopupUpdate: (value: boolean) => void,
  setSelectedCategory: (parentId: string | null) => void,
) => {
  const { getListProductAll, fetchListProductAll } = useAdminProductAll()
  const { getDetailProduct, fetchDetailProduct } = useAdminProductDetail()

  const getListAllProduct = async () => {
    await fetchListProductAll(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage, search.value, categorySelectedFilter.value)
   
    if(!getListProductAll.value) return
    dataList.value = getListProductAll.value.data
    totalItems.value = getListProductAll.value.pagination.total
    currentTableOptions.value.page = getListProductAll.value.pagination.page
    currentTableOptions.value.itemsPerPage = getListProductAll.value.pagination.limit
  }

  const ListDataApi = {
    async fetch({ items}: {
      items: ProductDTO[],
    }) {
      return new Promise(resolve => {
        setTimeout(() => {
          let filtered = items.slice()

          resolve({ items: filtered })
        }, 200)
      })
    },
  }

  async function loadItems(opt: TableOpt) {
    loadingTable.value = true

    await getListAllProduct()

    const { items } = await ListDataApi.fetch({
      items: dataList.value || [],
    }) as { items: ProductDTO[] }

    serverItems.value = items
    if(getListProductAll.value) totalItems.value = getListProductAll.value.pagination.total

    loadingTable.value = false
  }

  watch(
    () => ({
      search: search.value,
      categorySelectedFilter: categorySelectedFilter.value,
      page: currentTableOptions.value.page,
      limit: currentTableOptions.value.itemsPerPage,
    }),
    () => {
      loadItems(currentTableOptions.value)
    },
    { deep: true }
  )

  const handleReload = async () => {
    await loadItems(currentTableOptions.value);
  }

  async function submitCreate() {
    Loading(true);

    try {
      const newProduct = unref(formProductItem);
      if(!newProduct.sku) newProduct.sku = await generateSkuProduct(newProduct.categoryId)

      const data = await productsAPI.create(newProduct)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupAdd.value = false;
        handleReset()
        handleReload()
      } else showWarning(data.message ?? '')
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const handleEditProduct = async (productId: string) => {
    if(!productId) return
    Object.assign(updateProductItem, defaultForm);

    await fetchDetailProduct(productId)
    if(getDetailProduct.value) detailData.value = getDetailProduct.value
    if(!detailData.value) return
    handleTogglePopupUpdate(true)
    Object.assign(updateProductItem, detailData.value);
    const realUpdateItem = unref(updateProductItem);
    if(realUpdateItem.categoryId) setSelectedCategory(realUpdateItem.categoryId)
  }

  async function submitUpdate() {
    Loading(true);
    try {
      const realUpdateItem = unref(updateProductItem);
      if(!realUpdateItem.sku) {
        realUpdateItem.sku = await generateSkuProduct(realUpdateItem.categoryId)
      } 

      if(realUpdateItem.id == '' && !realUpdateItem.id) return

      const data = await productsAPI.update(realUpdateItem.id, realUpdateItem)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        isTogglePopupUpdate.value = false;
        handleReset()
        handleReload()
      } else showWarning(data.message ?? '')
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const handleDeleteProduct = async (productId: string) => {
    const confirm = await showConfirm('Bạn có chắc xoá mục này?')
    if (!confirm) return

    Loading(true);
    try {
      const data = await productsAPI.delete(productId)
      if(data.code === 0){
        showSuccess(data.message ?? '')
        handleReload()
      } else showWarning(data.message ?? '')
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const handleDeleteManyProducts = async () => {
    if (!selectedIdsDelete.value || selectedIdsDelete.value.length === 0) {
      showWarning("Không có sản phẩm nào được chọn để xoá");
      return;
    }

    const confirm = await showConfirm(`Bạn có chắc xoá ${selectedIdsDelete.value.length} sản phẩm này?`)
    if (!confirm) return;

    Loading(true);

    try {
      const data = await productsAPI.deleteMany(selectedIdsDelete.value);

      if (data.code === 0) {
        showSuccess(data.message ?? '');
        handleReload();
      } else {
        showWarning(data.message ?? '');
      }

    } catch (err) {
      console.error('Error deleting products:', err);
    } finally {
      Loading(false);
      selectedIdsDelete.value = []
    }
  };

  const resetFilter = () => {
    search.value = ''
    categorySelectedFilter.value = ''
    currentTableOptions.value.page = 1
    currentTableOptions.value.itemsPerPage = itemsPerPage
  }

  const hasFilter = computed(() => {
    return (
      search.value !== '' ||
      categorySelectedFilter.value !== '' ||
      currentTableOptions.value.page !== 1 ||
      currentTableOptions.value.itemsPerPage !== itemsPerPage
    )
  })

  return {
    handleEditProduct,
    handleDeleteProduct,
    getListAllProduct,
    loadItems,
    submitCreate,
    submitUpdate,
    handleReload,
    handleDeleteManyProducts,
    resetFilter,
    hasFilter,
  };
};