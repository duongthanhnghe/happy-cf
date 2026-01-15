import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useOrderStatus } from '@/composables/order/useOrderStatus';
import type { OrderStatusDTO } from '@/server/types/dto/v1/order.dto'

const TTL_MS = 10 * 24 * 60 * 60 * 1000; // 10 days

export const useOrderStatusStore = defineStore("OrderStatusStore", () => {
  const { getListOrderStatus, fetchOrderStatus } = useOrderStatus();

  const dataList = ref<OrderStatusDTO[]>([])
  const lastFetched = ref<number | null>(null)
  const loading = ref(false)

  const fetchOrderStatusStore = async () => {
    const now = Date.now()
    if (dataList.value.length > 0 && lastFetched.value && now - lastFetched.value < TTL_MS) return

    loading.value = true
    try {
      await fetchOrderStatus()
      dataList.value = getListOrderStatus.value
      lastFetched.value = now
    } finally {
      loading.value = false
    }
  }

  const getListData = computed(() => dataList.value);
  
  return {
    dataList,
    fetchOrderStatusStore,
    getListData,
    lastFetched,
    loading,
  };
}, {
  persist: {
    key: 'OrderStatusPinia',
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    paths: ['dataList','lastFetched'],
  }
})
