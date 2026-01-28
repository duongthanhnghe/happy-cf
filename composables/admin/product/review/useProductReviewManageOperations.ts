import type { Ref } from 'vue';
import { watch } from 'vue';
import { Loading } from '@/utils/global';
import { showConfirm, showSuccess, showWarning } from '@/utils/toast';
import type { TableOpt } from '@/server/types';
import type { ProductReviewPaginationDTO, ProductReviewWithUserDTO, ReviewStatus } from '@/server/types/dto/v1/product-review.dto';
import { useAdminProductReviewAll } from '@/composables/admin/product/review/useAdminProductReviewAll';
import { productReviewAPI } from '@/services/v1/admin/productReview.service';
import { useTableUtils } from '@/composables/utils/useTableSearch';

export const useProductReviewManageOperations = (
  dataList: Ref<ProductReviewPaginationDTO|null>,
  serverItems: Ref<ProductReviewWithUserDTO[]>,
  loadingTable: Ref<boolean>,
  totalItems: Ref<number>,
  search: Ref<string>,
  searchInput: Ref<string>,
  fromDay: Ref<string>,
  toDay: Ref<string>,
  currentTableOptions: Ref<TableOpt>,
  filterStatusOrder: Ref<string|null>,
  filterNumberStar:Ref<string|null>,
  isTogglePopupAdd: Ref<boolean>,
) => {

  const { getListReview, fetchListReviewAll } = useAdminProductReviewAll();

  const getListData = async () => {

    const from = fromDay.value !== '' ? new Date(fromDay.value).toISOString().slice(0, 10) : ''
    const to = toDay.value !== '' ? new Date(toDay.value).toISOString().slice(0, 10) : ''

    await fetchListReviewAll(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage, from, to, search.value, filterNumberStar.value, filterStatusOrder.value);

    if(!getListReview || getListReview.value?.code !== 0) return
    dataList.value = getListReview.value
    totalItems.value = getListReview.value.pagination.total
    currentTableOptions.value.page = getListReview.value.pagination.page
    currentTableOptions.value.itemsPerPage = getListReview.value.pagination.limit
  }

  const ListAllData = {
    async fetch({
      items,
    }: {
      items: ProductReviewWithUserDTO[],
    }) {
      return new Promise(resolve => {
        setTimeout(() => {
          let filtered = items.slice()

          resolve({ items: filtered })
        }, 300)
      })
    }
  }
    
  async function loadItems(opt:TableOpt) {
    loadingTable.value = true;

    await getListData();
    if(!dataList.value?.data) return

    const { items } = (await ListAllData.fetch({
      items: dataList.value?.data,
    })) as { items: ProductReviewWithUserDTO[] }

    serverItems.value = items;
    if(dataList.value?.data) totalItems.value = dataList.value.pagination.total
    loadingTable.value = false;
  }

  watch(
    () => ({
      filterStatusOrder: filterStatusOrder.value,
      filterNumberStar: filterNumberStar.value,
      fromDay: fromDay.value,
      toDay: toDay.value,
      page: currentTableOptions.value.page,
      limit: currentTableOptions.value.itemsPerPage,
    }),
    () => {
      loadItems(currentTableOptions.value)
    },
    { deep: true }
  )

  const handleTogglePopupAdd = (value: boolean) => {
    isTogglePopupAdd.value = value;
  };

  const handleReload = async () => {
    await loadItems(currentTableOptions.value);
  }

  const handleDelete = async (id: string) => {
    const confirmed = await showConfirm('Bạn có chắc xoá?')
    if (!confirmed) return
  
    Loading(true);
    try {
      const data = await productReviewAPI.delete(id)
      if(data.code === 0) {
        showSuccess(data.message ?? '')
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const handleUpdateStatus = async (id:string, status:ReviewStatus) => {
    Loading(true);
    try {
      const data = await productReviewAPI.updateStatus(id, status)
      if(data.code === 0) {
        showSuccess(data.message ?? '')
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
    } catch (err) {
      console.error('Error submitting form:', err)
    } finally {
      Loading(false);
    }
  }

  const { handleSearch } = useTableUtils(search, searchInput );

  const resetFilter = () => {
    searchInput.value = ''
    search.value = ''
    fromDay.value = ''
    toDay.value = ''
    filterStatusOrder.value = null
    filterNumberStar.value = null
    currentTableOptions.value.page = 1
    currentTableOptions.value.itemsPerPage = 20
  }

  return {
    handleTogglePopupAdd,
    getListData,
    loadItems,
    handleReload,
    handleDelete,
    handleUpdateStatus,
    resetFilter,
    handleSearch,
  };
};
