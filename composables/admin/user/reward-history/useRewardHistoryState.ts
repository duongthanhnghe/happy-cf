import { ref } from 'vue';
import type { TableHeaders, TableOpt } from '@/server/types';
import type { HistoryType, RewardHistoryDTO } from '@/server/types/dto/v1/reward-history.dto';

export const useRewardHistoryState = () => {

    const dataList = ref<RewardHistoryDTO[]>([]);
    const headers = ref<TableHeaders[]>([
      { title: 'Mã đơn hàng', key: 'code', sortable: false },
      { title: 'Khách hàng', key: 'user', sortable: false },
      { title: 'Loại giao dịch', key: 'historyType', sortable: false },
      { title: 'Điểm', key: 'points', sortable: false },
      { title: 'Thời gian', key: 'createdAt', sortable: false },
    ])
    const serverItems = ref<RewardHistoryDTO[]>([])
    const loadingTable = ref<boolean>(true)
    const totalItems = ref<number>(0)
    const fromDay = ref<string>('')
    const toDay = ref<string>('')
    const search = ref<string>('')
    const searchInput = ref<string>('')
    const filterTypeReward = ref<HistoryType | null>(null)
    const currentTableOptions = ref<TableOpt>({
    page: 1,
    itemsPerPage: 20,
    sortBy: [],
  })

  return {
    dataList,
    serverItems,
    loadingTable,
    totalItems,
    search,
    searchInput,
    fromDay,
    toDay,
    headers,
    currentTableOptions,
    filterTypeReward,
  };
};