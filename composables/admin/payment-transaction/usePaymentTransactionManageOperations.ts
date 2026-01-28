import type { Ref } from 'vue';
import { watch } from 'vue';
import { paymentTransactionsAPI } from '@/services/v1/admin/payment-transaction.service';
import type { PaymentTransactionDTO, PaymentTransactionPaginationDTO } from '@/server/types/dto/v1/payment-transaction.dto';
import type { TableOpt } from '@/server/types';
import { useOrderStatus } from '@/composables/admin/order/useOrderStatus';
import { usePaymentTransactionDetail } from './usePaymentTransactionDetail';
import { useTableUtils } from '@/composables/utils/useTableSearch';

export const usePaymentTransactionManageOperations = (
  dataList: Ref<PaymentTransactionPaginationDTO|null>,
  serverItems: Ref<PaymentTransactionDTO[]>,
  loadingTable: Ref<boolean>,
  totalItems: Ref<number>,
  search: Ref<string>,
  searchInput: Ref<string>,
  fromDay: Ref<string>,
  toDay: Ref<string>,
  currentTableOptions: Ref<TableOpt>,
  filterStatus: Ref<string>,
  filterPaymentMethod:Ref<string>,
  togglePopupDetail: Ref<boolean>,
) => {

  const { getListOrderStatus, fetchOrderStatus } = useOrderStatus();
  const { getDetail, fetchDetailTransaction } = usePaymentTransactionDetail()

  const getListAll = async () => {
    const from = fromDay.value !== '' ? new Date(fromDay.value).toISOString().slice(0, 10) : ''
    const to = toDay.value !== '' ? new Date(toDay.value).toISOString().slice(0, 10) : ''

    const data = await paymentTransactionsAPI.getAll(
      currentTableOptions.value.page, 
      currentTableOptions.value.itemsPerPage, 
      from, 
      to, 
      search.value, 
      filterStatus.value, 
      filterPaymentMethod.value,
    );

    if(data.code !== 0) return
    dataList.value = data
    totalItems.value = data.pagination.total
    currentTableOptions.value.page = data.pagination.page
    currentTableOptions.value.itemsPerPage = data.pagination.limit
  }

  const ListAllApi = {
    async fetch({
      items,
    }: {
      items: PaymentTransactionDTO[],
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
    if(getListOrderStatus.value.length === 0) await fetchOrderStatus()

    await getListAll();
    if(!dataList.value?.data) return

    const { items } = (await ListAllApi.fetch({
      items: dataList.value?.data,
    })) as { items: PaymentTransactionDTO[] }

    serverItems.value = items;
    if(dataList.value?.data) totalItems.value = dataList.value.pagination.total
    loadingTable.value = false;
  }

   watch(
    () => ({
      filterStatus: filterStatus.value,
      filterPaymentMethod: filterPaymentMethod.value,
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

  const handleTogglePopupDetail = async (id: string) => {
    await fetchDetailTransaction(id);
    togglePopupDetail.value = !togglePopupDetail.value;
  };

  const { handleSearch } = useTableUtils(search, searchInput );

  const resetFilter = () => {
    searchInput.value = ''
    search.value = ''
    fromDay.value = ''
    toDay.value = ''
    filterStatus.value = ''
    filterPaymentMethod.value = ''
    currentTableOptions.value.page = 1
    currentTableOptions.value.itemsPerPage = 20
  }

  return {
    handleTogglePopupDetail,
    getListAll,
    loadItems,
    resetFilter,
    getDetail,
    fetchDetailTransaction,
    handleSearch,
  };
};