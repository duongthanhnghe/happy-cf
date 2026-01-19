import { ref } from "vue";
import type { TableHeaders, TableOpt } from "@/server/types";
import type { PaymentTransactionDTO, PaymentTransactionPaginationDTO } from '@/server/types/dto/v1/payment-transaction.dto';

export const usePaymentTransactionManageState = () => {

  const dataList = ref<PaymentTransactionPaginationDTO|null>(null)
  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },

    { 
      title: 'Mã giao dịch', 
      key: 'id', 
      sortable: false 
    },

    { 
      title: 'Mã đơn hàng', 
      key: 'orderId', 
      sortable: false 
    },

    { 
      title: 'Mã tham chiếu', 
      key: 'txnRef', 
      sortable: false 
    },

    { 
      title: 'PT thanh toán', 
      key: 'method', 
      sortable: false 
    },

    { 
      title: 'Số tiền', 
      key: 'amount', 
      sortable: false 
    },

    { 
      title: 'Trạng thái', 
      key: 'status', 
      sortable: false 
    },

    { 
      title: 'Thời gian thanh toán', 
      key: 'paidAt', 
      sortable: false 
    },

    { 
      title: 'Ngày tạo', 
      key: 'createdAt', 
      sortable: false 
    },

    {
      title: '',
      key: 'actions',
      sortable: false,
      headerProps: { class: 'v-data-table-sticky-cl-right' },
      cellProps: { class: 'v-data-table-sticky-cl-right' },
    },
  ])
  const serverItems = ref<PaymentTransactionDTO[]>([])
  const loadingTable = ref<boolean>(true)
  const totalItems = ref<number>(0)
  const search = ref<string>('')
  const fromDay = ref<string>('')
  const toDay = ref<string>('')
  const currentTableOptions = ref<TableOpt>({
    page: 1,
    itemsPerPage: 20,
    sortBy: [],
  })
  const filterStatus = ref<string>('')
  const filterPaymentMethod = ref<string>('')
  const togglePopupDetail = ref(false);

  return {
    dataList,
    togglePopupDetail,
    serverItems,
    loadingTable,
    totalItems,
    search,
    fromDay,
    toDay,
    headers,
    currentTableOptions,
    filterStatus,
    filterPaymentMethod,
  };
};