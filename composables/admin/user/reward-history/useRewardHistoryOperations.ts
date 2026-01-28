import type { Ref } from 'vue';
import { computed, watch } from 'vue';
import type { TableOpt } from '@/server/types';
import type { HistoryType, RewardHistoryDTO } from '@/server/types/dto/v1/reward-history.dto';
import { useAdminHistoryReward } from '@/composables/user/useAdminHistoryReward';
import { useTableUtils } from '@/composables/utils/useTableSearch';

export const useRewardHistoryOperations = (
  dataList: Ref<RewardHistoryDTO[]>,
  serverItems: Ref<RewardHistoryDTO[]>,
  loadingTable: Ref<boolean>,
  totalItems: Ref<number>,
  search: Ref<string>,
  searchInput: Ref<string>,
  fromDay: Ref<string>,
  toDay: Ref<string>,
  currentTableOptions: Ref<TableOpt>,
  filterTypeReward: Ref<HistoryType | null>,
) => {

  const { getListOrder, fetchListOrder } = useAdminHistoryReward()

  const getListData = async () => {
    const from = fromDay.value !== '' ? new Date(fromDay.value).toISOString().slice(0, 10) : ''
    const to = toDay.value !== '' ? new Date(toDay.value).toISOString().slice(0, 10) : ''

    await fetchListOrder(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage,'', search.value,filterTypeReward.value,from,to)

    if(!getListOrder.value) return
    dataList.value = getListOrder.value.data
    totalItems.value = getListOrder.value.pagination.total
    currentTableOptions.value.page = getListOrder.value.pagination.page
    currentTableOptions.value.itemsPerPage = getListOrder.value.pagination.limit
  }

  const ListAllApi = {
    async fetch({ items }: {
      items: RewardHistoryDTO[],
    }) {
      return new Promise(resolve => {
        setTimeout(() => {
          let filtered = items.slice()

          resolve({ items: filtered })
        }, 500)
      })
    },
  }

  async function loadItems(opt: TableOpt) {
    loadingTable.value = true
    await getListData()

    const { items } = await ListAllApi.fetch({
      items: dataList.value || [],
    }) as { items: RewardHistoryDTO[] }

    serverItems.value = items
    if(getListOrder.value) totalItems.value = getListOrder.value.pagination.total

    loadingTable.value = false
  }

  watch(
    () => ({
      filterTypeReward: filterTypeReward.value,
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

  const handleReload = async () => {
    await loadItems(currentTableOptions.value);
  }

  const { handleSearch } = useTableUtils(search, searchInput );

  const resetFilter = () => {
    searchInput.value = ''
    search.value = ''
    filterTypeReward.value = null
    fromDay.value = ''
    toDay.value = ''
    currentTableOptions.value.page = 1
    currentTableOptions.value.itemsPerPage = 20
  }

  const hasFilter = computed(() => {
    return (
      search.value !== '' ||
      filterTypeReward.value !== null ||
      fromDay.value !== '' ||
      toDay.value !== '' ||
      currentTableOptions.value.page !== 1 ||
      currentTableOptions.value.itemsPerPage !== 20
    )
  })

  return {
    hasFilter,
    getListData,
    loadItems,
    handleReload,
    resetFilter,
    handleSearch,
  };
};