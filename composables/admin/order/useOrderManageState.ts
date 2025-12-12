import { ref } from "vue";
import type { OrderDTO, OrderPaginationDTO } from "@/server/types/dto/v1/order.dto";
import type { TableHeaders, TableOpt } from "@/server/types";

export const useOrderManageState = () => {

  const dataListOrder = ref<OrderPaginationDTO|null>(null)
  const headers = ref<TableHeaders[]>([
    { title: 'STT', key: 'index', sortable: false },
    { title: 'Mã đơn hàng', key: 'code', sortable: false, },
    { title: 'Khách hàng', key: 'fullname', sortable: false, },
    { title: 'Sản phẩm', key: 'cartItems', sortable: false, headerProps: { class: 'white-space min-width-200' }, cellProps: { class: 'white-space min-width-200' }},
    { title: 'TT Thanh toán', key: 'transaction', sortable: false, },
    { title: 'Tổng tiền', key: 'totalPrice', sortable: false, },
    { title: 'Tình trạng đơn', key: 'status', sortable: false, },
    { title: 'Địa chỉ', key: 'address', sortable: false, },
    { title: 'Thời gian lấy hàng', key: 'time', sortable: false, },
    { title: 'Thời gian đặt hàng', key: 'createdAt', sortable: false, },
    { title: 'HTTT', key: 'paymentId', sortable: false, },
    { title: 'Yêu cầu huỷ đơn', key: 'cancelRequested', sortable: false, },
    { title: '', key: 'actions', sortable: false, headerProps: { class: 'v-data-table-sticky-cl-right' },
      cellProps: { class: 'v-data-table-sticky-cl-right' }},
  ])
  const serverItems = ref<OrderDTO[]>([])
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
  const filterStatusOrder = ref<string>('')
  const filterStatusTransactionOrder = ref<string>('')
  const isTogglePopupAdd = ref(false);

  return {
    dataListOrder,
    isTogglePopupAdd,
    serverItems,
    loadingTable,
    totalItems,
    search,
    fromDay,
    toDay,
    headers,
    currentTableOptions,
    filterStatusOrder,
    filterStatusTransactionOrder,
  };
};