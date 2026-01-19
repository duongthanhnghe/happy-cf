import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { usePaymentMethod } from '@/composables/order/usePaymentMethod';
import type { PaymentDTO } from '@/server/types/dto/v1/order.dto'

export const usePaymentMethodStore = defineStore("PaymentMethodStore", () => {
  const { getListPaymentMethod, fetchPaymentMethod } = usePaymentMethod();

  const dataList = ref<PaymentDTO[]>([])
  const loading = ref(false)

  const fetchPaymentMethodStore = async () => {

    loading.value = true
    try {
      await fetchPaymentMethod()
      dataList.value = getListPaymentMethod.value
    } finally {
      loading.value = false
    }
  }

  const getListData = computed(() => dataList.value);
  
  return {
    dataList,
    fetchPaymentMethodStore,
    getListData,
    loading,
  };
})
