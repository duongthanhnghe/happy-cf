import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { ordersAPI } from "@/services/orders.service";
import type { OrderDTO } from '@/server/types/dto/order.dto'
import type { TableOpt, TableHeaders, FilterTime } from '@/server/types/dto/table-vuetify.dto'
import {
  Loading
} from '@/utils/global'
import { useOrderStatus } from "@/composables/order/useOrderStatus";
import { usePaymentStatus } from "@/composables/order/usePaymentStatus";
import { showConfirm, showSuccess, showWarning } from "@/utils/toast";

export const useOrderManageStore = defineStore("OrderManage", () => {

const { getListOrderStatus, fetchOrderStatus } = useOrderStatus();
const { getListPaymentStatus, fetchPaymentStatus } = usePaymentStatus();

//state list
const dataListOrder = ref<OrderDTO[]|null>(null)
const itemsPerPage = 10
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
  itemsPerPage: itemsPerPage,
  sortBy: [],
})
const filterStatusOrder = ref<string|null>()
const isTogglePopupAdd = ref(false);

//actions list
const getListAllProduct = async () => {
  const data = await ordersAPI.getAll();
  if(data.code === 0) dataListOrder.value = data.data
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
  async fetch ({ page, itemsPerPage, sortBy, search, filterStatusOrder, filterTime }: TableOpt & {
    search: { fullname?: string; phone?: string; idOrder?: string }
    filterStatusOrder?: string|null
    filterTime?: FilterTime
  }) {
    return new Promise(resolve => {
      setTimeout(() => {
        const start = (page - 1) * itemsPerPage
        const end = start + itemsPerPage

        const items = dataListOrder.value?.slice().filter(item => {
          if (search.fullname && !item.fullname.toLowerCase().includes(search.fullname.toLowerCase())) {
            return false
          } 
          if (search.phone && !String(item.phone || '').includes(String(search.phone))) {
            return false
          } 
          if (search.idOrder && !item.code.toLowerCase().includes(search.idOrder.toLowerCase())) {
            return false
          } 
          if (filterStatusOrder && item.status.toString() !== filterStatusOrder ) {
            return false
          }
          if (filterTime && !filterByDate(item, filterTime)) {
            return false
          }
          else {
            return true
          }
        })

        if (sortBy.length) {
          const sortKey = sortBy[0].key
          const sortOrder = sortBy[0].order
          items?.sort((a: any, b: any) => {
            const aValue = a[sortKey]
            const bValue = b[sortKey]
            return sortOrder === 'desc' ? bValue - aValue : aValue - bValue
          })
        }
        const paginated = items?.slice(start, end === -1 ? undefined : end)
        resolve({ items: paginated, total: items?.length })
      }, 500)
    })
  },
}
  
async function loadItemsProduct(opt:TableOpt) {
  loadingTable.value = true;

  await getListAllProduct();

  const {items, total} = await ListAllProductApi.fetch({ page:opt.page , itemsPerPage: opt.itemsPerPage, sortBy:opt.sortBy, search: { fullname: name.value, phone: phone.value, idOrder: idOrder.value },filterTime: { fromDay: fromDay.value, toDay: toDay.value } ,filterStatusOrder: filterStatusOrder.value }) as { items: OrderDTO[], total: number };
    serverItems.value = items;
    totalItems.value = total;
    loadingTable.value = false;
  }

  watch([name, phone, idOrder, fromDay, filterStatusOrder], () => {
  loadItemsProduct(currentTableOptions.value);
});

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
        if(dataListOrder.value){
          dataListOrder.value = dataListOrder.value?.filter(item => 
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
    itemsPerPage,
    headers,
    currentTableOptions,
    filterStatusOrder,
    // actions
    handleTogglePopupAdd,
    getListAllProduct,
    loadItemsProduct,
    handleReload,
    handleDelete,
    getListStatus
  };
});