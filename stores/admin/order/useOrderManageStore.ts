import type { OrderDTO, OrderPaginationDTO } from '@/server/types/dto/v1/order.dto'
import type { PaymentMethod } from '@/server/types/dto/v1/payment-transaction.dto'
import type { TableOpt, TableHeaders, FilterTime } from '@/server/types/dto/v1/table-vuetify.dto'
import type { PaymentTransactionStatus } from "@/server/types/dto/v1/payment-transaction.dto"
import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { ordersAPI } from "@/services/v1/admin/orders.service";
import { paymentTransactionsAPI } from "@/services/v1/admin/payment-transaction.service";
import { Loading } from '@/utils/global'
import { useOrderStatus } from "@/composables/shared/order/useOrderStatus";
import { showConfirm, showSuccess, showWarning } from "@/utils/toast";
import { ORDER_STATUS } from "@/shared/constants/order-status";

export const useOrderManageStore = defineStore("OrderManage", () => {

const { getListOrderStatus, fetchOrderStatus } = useOrderStatus();

const dataListOrder = ref<OrderPaginationDTO>()
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

const getListAllProduct = async () => {
  const from = fromDay.value !== '' ? new Date(fromDay.value).toISOString().slice(0, 10) : ''
  const to = toDay.value !== '' ? new Date(toDay.value).toISOString().slice(0, 10) : ''

  const data = await ordersAPI.getAll(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage, from, to, search.value, filterStatusOrder.value, filterStatusTransactionOrder.value);

  if(data.code !== 0) return
  dataListOrder.value = data
  totalItems.value = data.pagination.total
  currentTableOptions.value.page = data.pagination.page
  currentTableOptions.value.itemsPerPage = data.pagination.limit
}

const ListAllProductApi = {
  async fetch({
    items,
  }: {
    items: OrderDTO[],
  }) {
    return new Promise(resolve => {
      setTimeout(() => {
        let filtered = items.slice()
       
        resolve({ items: filtered })
      }, 300)
    })
  }
}

async function loadItemsProduct(opt:TableOpt) {
  loadingTable.value = true;

  await getListAllProduct();
  if(!dataListOrder.value?.data) return

  const { items } = (await ListAllProductApi.fetch({
    items: dataListOrder.value?.data,
  })) as { items: OrderDTO[] }

  serverItems.value = items;
  if(dataListOrder.value?.data) totalItems.value = dataListOrder.value.pagination.total
  loadingTable.value = false;
}

  watch([search, fromDay, toDay, filterStatusOrder, filterStatusTransactionOrder], () => {
    loadItemsProduct(currentTableOptions.value);
  });

  watch(() => [currentTableOptions.value.page,currentTableOptions.value.itemsPerPage], () => {
    loadItemsProduct(currentTableOptions.value);
  })

  const handleTogglePopupAdd = (value: boolean) => {
    isTogglePopupAdd.value = value;
  };

  const handleReload = async () => {
    await loadItemsProduct(currentTableOptions.value);
  }

  const handleDelete = async (orderId: string) => {
    const confirmed = await showConfirm('Bạn có chắc xoá?')
    if (!confirmed) return
  
    Loading(true);
    try {
      const data = await ordersAPI.delete(orderId)
      if(data.code === 0) {
        showSuccess(data.message ?? '')
        if(dataListOrder.value?.data){
          dataListOrder.value.data = dataListOrder.value?.data?.filter(item => 
            item.id !== orderId
          )
        }
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

  const handleUpdateStatusOrder = async (orderId:string, idStatusNew:string, statusName: string, transactionId: string | undefined, amount: number, method: PaymentMethod) => {
    if(idStatusNew === ORDER_STATUS.CANCELLED || idStatusNew === ORDER_STATUS.COMPLETED ) {
      const confirmed = await showConfirm(`Bạn có chắc chan: ${statusName}?`)
      if (!confirmed) return
    }

    Loading(true);
    try {
      const data = await ordersAPI.updateStatusOrder(orderId, idStatusNew)
      if(data.code === 0) {
        showSuccess(data.message ?? '')
        if(!transactionId){
          if(idStatusNew === ORDER_STATUS.CONFIRMED || idStatusNew === ORDER_STATUS.DELIVERING || idStatusNew === ORDER_STATUS.COMPLETED) {
            await paymentTransactionsAPI.create({orderId, amount, method})
          }
        }
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

  const handleUpdateStatusTransactionOrder = async (transactionId:string, status: PaymentTransactionStatus) => {
    Loading(true);
    try {
      const data = await paymentTransactionsAPI.updateStatus(transactionId, status)
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

  const resetFilter = () => {
    search.value = ''
    fromDay.value = ''
    toDay.value = ''
    filterStatusOrder.value = ''
    filterStatusTransactionOrder.value = ''
    currentTableOptions.value.page = 1
    currentTableOptions.value.itemsPerPage = 20
  }

  const hasFilter = computed(() => {
    return (
      search.value !== '' ||
      fromDay.value !== '' ||
      toDay.value !== '' ||
      filterStatusOrder.value !== '' ||
      filterStatusTransactionOrder.value !== '' ||
      currentTableOptions.value.page !== 1 ||
      currentTableOptions.value.itemsPerPage !== 20
    )
  })

  const statusListToShow = (order: OrderDTO) => {
    if (order.status.id === ORDER_STATUS.CANCELLED) return [];

    if (order.cancelRequested || order.status.id === ORDER_STATUS.COMPLETED) {
      return getListStatus.value.filter(s => s.id === ORDER_STATUS.CANCELLED);
    }

    return getListStatus.value;
  };

  watch(() => getListOrderStatus.value, async (newValue) => {
    if(newValue.length === 0) await fetchOrderStatus()
  }, { immediate: true })

  const getListStatus = computed(() => getListOrderStatus.value)
  
  return {
    // state
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
    hasFilter,
    // actions
    handleTogglePopupAdd,
    getListAllProduct,
    loadItemsProduct,
    handleReload,
    handleDelete,
    handleUpdateStatusOrder,
    handleUpdateStatusTransactionOrder,
    resetFilter,
    statusListToShow,
    getListStatus
  };
});