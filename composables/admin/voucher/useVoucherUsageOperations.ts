import type { Ref } from 'vue';
import { computed, watch } from 'vue';
import type { TableOpt } from '@/server/types';
import { vouchersUsageAPI } from '@/services/v1/admin/voucher-usage.service';
import type { VoucherUsageDTO, VoucherUsagePaginationDTO } from '@/server/types/dto/v1/voucher-usage.dto';
import { useTableUtils } from '@/composables/utils/useTableSearch';

export const useVoucherUsageOperations = (
  dataList: Ref<VoucherUsagePaginationDTO|null>,
  serverItems: Ref<VoucherUsageDTO[]>,
  loadingTable: Ref<boolean>,
  totalItems: Ref<number>,
  search: Ref<string>,
  searchInput: Ref<string>,
  fromDay: Ref<string>,
  toDay: Ref<string>,
  currentTableOptions: Ref<TableOpt>,
  filterType: Ref<string | null>,
  itemsPerPage: number
) => {

  const getListData = async () => {
    const from = fromDay.value !== '' ? new Date(fromDay.value).toISOString().slice(0, 10) : ''
    const to = toDay.value !== '' ? new Date(toDay.value).toISOString().slice(0, 10) : ''

    const res = await vouchersUsageAPI.getAll(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage, {
      code: search.value,
      type: filterType.value,
      fromDate: from,
      toDate: to,
      // reverted: false,
    });
    if (res.code !== 0) return

    dataList.value = res
    totalItems.value = res.pagination.total
    currentTableOptions.value.page = res.pagination.page
    currentTableOptions.value.itemsPerPage = res.pagination.limit
  };

  const ListAllVoucherApi = {
    async fetch({items}: {items: VoucherUsageDTO[]}) {
      return new Promise(resolve => {
        setTimeout(() => {
          let filtered = items.slice()

          resolve({ items: filtered })
        }, 300)
      })
    },
  };

  async function loadItems(opt: TableOpt) {
    loadingTable.value = true;
    await getListData();

    const { items } = (await ListAllVoucherApi.fetch({
      items: dataList.value?.data || [],
    })) as { items: VoucherUsageDTO[] };

    serverItems.value = items;
    if(dataList.value?.data) totalItems.value = dataList.value.pagination.total
    loadingTable.value = false;
  }

  watch(
    () => ({
      filterType: filterType.value,
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

  const { handleSearch } = useTableUtils(search, searchInput );

  const resetFilter = () => {
    searchInput.value = ''
    search.value = ''
    fromDay.value = ''
    toDay.value = ''
    filterType.value = null
    currentTableOptions.value.page = 1
    currentTableOptions.value.itemsPerPage = itemsPerPage
  }

  const hasFilter = computed(() => {
    return (
      search.value !== '' ||
      fromDay.value !== '' ||
      toDay.value !== '' ||
      filterType.value !== null ||
      currentTableOptions.value.page !== 1 ||
      currentTableOptions.value.itemsPerPage !== itemsPerPage
    )
  })

  const handleReload = async () => {
    await loadItems(currentTableOptions.value);
  };

  return {
    hasFilter,
    loadItems,
    handleReload,
    resetFilter,
    handleSearch,
  };
};