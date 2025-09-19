import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { ordersAPI } from "@/services/orders.service";
import type { OrderDTO, OrderPaginationDTO } from '@/server/types/dto/order.dto'
import type { TableOpt, TableHeaders, FilterTime } from '@/server/types/dto/table-vuetify.dto'
import {
  Loading
} from '@/utils/global'
import { useOrderStatus } from "@/composables/order/useOrderStatus";
import { showConfirm, showSuccess, showWarning } from "@/utils/toast";
import { ORDER_STATUS } from "@/shared/constants/order-status";

export const useOrderManageStore = defineStore("OrderManage", () => {

const { getListOrderStatus, fetchOrderStatus } = useOrderStatus();

//state list
const dataListOrder = ref<OrderPaginationDTO>()
const headers = ref<TableHeaders[]>([
  { title: 'STT', key: 'index', sortable: false },
  { title: 'Ma don hang', key: 'code', sortable: false, },
  { title: 'Nguoi dat', key: 'fullname', sortable: false, },
  { title: 'So dien thoai', key: 'phone', sortable: false, },
  { title: 'Dia chi', key: 'address', sortable: false, },
  { title: 'Lay hang luc', key: 'time', sortable: false, },
  { title: 'Dat hang luc', key: 'createdAt', sortable: false, },
  { title: 'Thanh toan', key: 'paymentId', sortable: false, },
  { title: 'Tong cong', key: 'totalPrice', sortable: false, },
  { title: 'Tinh trang don', key: 'status', sortable: false, },
  { title: 'Ghi chu', key: 'note', sortable: false, },
  { title: '', key: 'actions', sortable: false },
])
const serverItems = ref<OrderDTO[]>([])
const loadingTable = ref<boolean>(true)
const totalItems = ref<number>(0)
const name = ref<string>('')
const phone = ref<string>('')
const search = ref<string>('')
const idOrder = ref<string>('')
const fromDay = ref<string|null>(null)
const toDay = ref(new Date(new Date().setHours(23, 59, 59, 999)))
const currentTableOptions = ref<TableOpt>({
  page: 1,
  itemsPerPage: 20,
  sortBy: [],
})
const filterStatusOrder = ref<string|null>()
const isTogglePopupAdd = ref(false);

const getListAllProduct = async () => {
  const data = await ordersAPI.getAll(currentTableOptions.value.page, currentTableOptions.value.itemsPerPage);

  if(data.code !== 0) return
  dataListOrder.value = data
  totalItems.value = data.pagination.total
  currentTableOptions.value.page = data.pagination.page
  currentTableOptions.value.itemsPerPage = data.pagination.limit
}

const parseVNDateString = (dateStr:string) => {
  if (!dateStr) return null
  const isoLike = dateStr.replace(' ', 'T')
  const date = new Date(isoLike)
  return isNaN(date.getTime()) ? null : date
}

const filterByDate = (item:OrderDTO, filterTime:FilterTime) => {
  const itemDate = parseVNDateString(item.createdAt.toString())
  const from = filterTime.fromDay ? new Date(filterTime.fromDay) : null
  const to = filterTime.toDay ? new Date(filterTime.toDay) : null

  if (!itemDate || isNaN(itemDate.getTime())) return false

  if (from) from.setHours(0, 0, 0, 0)
  if (to) to.setHours(23, 59, 59, 999)

  return (!from || itemDate >= from) && (!to || itemDate <= to)
}

const ListAllProductApi = {
  async fetch({
    items,
    page,
    itemsPerPage,
    sortBy,
    search,
    filterStatusOrder,
    filterTime
  }: {
    items: OrderDTO[],
    page: number,
    itemsPerPage: number,
    sortBy: TableOpt["sortBy"],
    search: { fullname: string; phone: string; idOrder: string },
    filterStatusOrder?: string | null,
    filterTime?: FilterTime
  }) {
    return new Promise(resolve => {
      setTimeout(() => {
        let filtered = items.slice()

        if (search.fullname) {
          filtered = filtered.filter(item =>
            item.fullname.toLowerCase().includes(search.fullname.toLowerCase())
          )
        }
        if (search.phone) {
          filtered = filtered.filter(item =>
            String(item.phone || "").includes(String(search.phone))
          )
        }
        if (search.idOrder) {
          filtered = filtered.filter(item =>
            item.code.toLowerCase().includes(search.idOrder.toLowerCase())
          )
        }

        if (filterStatusOrder) {
          filtered = filtered.filter(item => item.status.toString() === filterStatusOrder)
        }
        if (filterTime) {
          filtered = filtered.filter(item => filterByDate(item, filterTime))
        }

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
    page: opt.page,
    itemsPerPage: opt.itemsPerPage,
    sortBy: opt.sortBy,
    search: {
      fullname: name.value,
      phone: phone.value,
      idOrder: idOrder.value,
    },
    filterTime: { fromDay: fromDay.value, toDay: toDay.value },
    filterStatusOrder: filterStatusOrder.value,
  })) as { items: OrderDTO[] }

  serverItems.value = items;
  if(dataListOrder.value?.data) totalItems.value = dataListOrder.value.pagination.total
  loadingTable.value = false;
}

  watch([name, phone, idOrder, fromDay, filterStatusOrder], () => {
    loadItemsProduct(currentTableOptions.value);
  });

  watch(() => [currentTableOptions.value.page,currentTableOptions.value.itemsPerPage], () => {
    loadItemsProduct(currentTableOptions.value);
  })

  // actions global
  const handleTogglePopupAdd = (value: boolean) => {
    isTogglePopupAdd.value = value;
  };

  const handleReload = async () => {
    await loadItemsProduct(currentTableOptions.value);
  }

  //actions delete
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
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
      Loading(false);
    }
  }

  const handleUpdateStatusOrder = async (idOrder:string, idStatusCurrent:string, idStatusNew:string) => {
    if(ORDER_STATUS.CANCELLED === idStatusNew) {
      const confirmed = await showConfirm('Bạn có chắc chan huy?')
      if (!confirmed) return
    }

    Loading(true);
    try {
      const data = await ordersAPI.updateStatusOrder(idOrder, idStatusNew)
      if(data.code === 0) {
        showSuccess(data.message ?? '')
        handleReload()
      } else {
        showWarning(data.message ?? '')
      }
      Loading(false);
    } catch (err) {
      console.error('Error submitting form:', err)
      Loading(false);
    }
  }

  watch(() => getListOrderStatus.value, async (newValue) => {
    if(newValue.length === 0) await fetchOrderStatus()
  }, { immediate: true })

  const getListStatus = computed(() => getListOrderStatus.value)

  //getters
  
  return {
    // state
    dataListOrder,
    isTogglePopupAdd,
    serverItems,
    loadingTable,
    totalItems,
    name,
    phone,
    search,
    idOrder,
    fromDay,
    toDay,
    headers,
    currentTableOptions,
    filterStatusOrder,
    // actions
    handleTogglePopupAdd,
    getListAllProduct,
    loadItemsProduct,
    handleReload,
    handleDelete,
    handleUpdateStatusOrder,
    getListStatus
  };
});