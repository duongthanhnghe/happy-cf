import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { ordersAPI } from "@/services/orders.service";
import type { OrderDTO} from '@/server/types/dto/order.dto'
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { useOrderStatusStore } from '@/stores/shared/useOrderStatusStore'

export const useOrderHistoryStore = defineStore("OrderHistory", () => {
  const storeAccount = useAccountStore();
  const storeOrderStatus = useOrderStatusStore();

  //state
  const dataList = ref<OrderDTO[]|null>(null)
  const isTogglePopupAdd = ref(false)
  const isTogglePopupDetail = ref(false)
  const idOrderPopupDetail = ref<string>('')
  const filterStatusOrder = ref<string|null>('')
  const items = ref<OrderDTO[]|null>(null)
  const pageSize = 10
  const checkPageDetail = ref(false)

  //actions
  const handleTogglePopupAdd = (value: boolean) => {
    isTogglePopupAdd.value = value
  }

  const getApiData = async () => {
    const userId = storeAccount.getDetailValue?.id;
    if (!userId) return

    const data = await ordersAPI.getByUserId(userId);
    if(data.code !== 0) return

    dataList.value = data.data
    if (filterStatusOrder.value) dataList.value = dataList.value.filter((order: OrderDTO) => order.status.id === filterStatusOrder.value)

    items.value = dataList.value.slice(0, pageSize)
  }
  
  function loadItems({ done }: { done: (status: 'ok' | 'empty') => void }) {
    if(!items.value) return
    const start = items.value.length
    const nextItems = dataList.value?.slice(start, start + pageSize)
    if(!nextItems) return
    setTimeout(() => {
      if (nextItems.length > 0) {
        if(!items.value) return
        items.value.push(...nextItems)
        done('ok')
      } else {
        done('empty')
      }
    }, 500)
  }

  const handleTogglePopupDetail = (value: boolean, id: string) => {
    isTogglePopupDetail.value = value;
    idOrderPopupDetail.value = id;
  };

  const setCheckPageDetail = (value: boolean) => {
    checkPageDetail.value = value
  }

  watch([filterStatusOrder], () => {
    getApiData()
  });

  watch(() => isTogglePopupAdd.value, async (newValue) => {
    // if(newValue && storeOrderStatus.getListData.length === 0) await storeOrderStatus.fetchOrderStatusStore()
    if(newValue && !dataList.value) getApiData()
  }, { immediate: true })

  watch(() => [isTogglePopupDetail.value,checkPageDetail.value,isTogglePopupAdd.value], async (newValue) => {
    if(newValue && storeOrderStatus.getListData.length === 0) await storeOrderStatus.fetchOrderStatusStore()
  }, { immediate: true })

  //getters
  const getItems = computed(() => items.value)
  const getIdOrderPopupDetail = computed(() => idOrderPopupDetail.value);
  const getCheckPageDetail = computed(() => checkPageDetail.value)
  const canLoadMore = computed(() => {
    if(!items.value?.length || !dataList.value?.length) return false
    return items.value.length < dataList.value.length
  })

  return {
    // state
    items,
    pageSize,
    isTogglePopupAdd,
    filterStatusOrder,
    isTogglePopupDetail,
    idOrderPopupDetail,
    // actions
    getApiData,
    handleTogglePopupAdd,
    loadItems,
    handleTogglePopupDetail,
    setCheckPageDetail,
    //getters
    // getListOrders,
    getItems,
    canLoadMore,
    getIdOrderPopupDetail,
    getCheckPageDetail
  };
});
