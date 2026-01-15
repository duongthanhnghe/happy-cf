import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { usePaymentStatus } from '@/composables/shared/order/usePaymentStatus';
import type { PaymentDTO } from '@/server/types/dto/v1/order.dto'

const TTL_MS = 10 * 24 * 60 * 60 * 1000; // 10 days

export const usePaymentStatusStore = defineStore("PaymentStatusStore", () => {
  const { getListPaymentStatus, fetchPaymentStatus } = usePaymentStatus();

  const dataList = ref<PaymentDTO[]>([])
  const lastFetched = ref<number | null>(null)
  const loading = ref(false)

  const fetchPaymentStatusStore = async () => {
    const now = Date.now()
    if (dataList.value.length > 0 && lastFetched.value && now - lastFetched.value < TTL_MS) return

    loading.value = true
    try {
      await fetchPaymentStatus()
      dataList.value = getListPaymentStatus.value
      lastFetched.value = now
    } finally {
      loading.value = false
    }
  }

  const getListData = computed(() => dataList.value);
  
  return {
    dataList,
    fetchPaymentStatusStore,
    getListData,
    lastFetched,
    loading,
  };
}, {
  persist: {
    key: 'PaymentStatusPinia',
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    paths: ['dataList','lastFetched'],
  }
})
