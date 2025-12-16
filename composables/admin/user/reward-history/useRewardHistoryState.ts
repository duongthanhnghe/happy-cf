import type { Ref } from 'vue';
import type { OrderDTO, OrderPaginationDTO } from "@/server/types/dto/v1/order.dto";
import { computed, ref, watch } from 'vue';
import { Loading } from '@/utils/global';
import { ordersAPI } from '@/services/v1/admin/orders.service';
import { ORDER_STATUS } from '@/shared/constants/order-status';
import { showConfirm, showSuccess, showWarning } from '@/utils/toast';
import { paymentTransactionsAPI } from '@/services/v1/admin/payment-transaction.service';
import type { PaymentMethod, PaymentTransactionStatus } from '@/server/types/dto/v1/payment-transaction.dto';
import type { TableHeaders, TableOpt } from '@/server/types';
import { useOrderStatus } from '@/composables/shared/order/useOrderStatus';
import type { HistoryType, RewardHistoryDTO } from '@/server/types/dto/v1/reward-history.dto';
import { useAdminHistoryReward } from '@/composables/user/useAdminHistoryReward';

export const useRewardHistoryState = () => {

    const dataList = ref<RewardHistoryDTO[]>([]);
    const headers = ref<TableHeaders[]>([
      { title: 'Order Code', key: 'code', sortable: false },
      { title: 'Khach hang', key: 'user', sortable: false, },
      { title: 'Loai', key: 'historyType', sortable: false, },
      { title: 'Diem', key: 'points', sortable: false, },
      { title: 'Thoi gian', key: 'createdAt', sortable: false, },
    ])
      const serverItems = ref<RewardHistoryDTO[]>([])
      const loadingTable = ref<boolean>(true)
      const totalItems = ref<number>(0)
      const fromDay = ref<string>('')
      const toDay = ref<string>('')
      const search = ref<string>('')
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
    fromDay,
    toDay,
    headers,
    currentTableOptions,
    filterTypeReward,
  };
};