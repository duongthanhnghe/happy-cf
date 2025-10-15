import { ref, computed } from "vue";
import { ordersAPI } from "@/services/v1/orders.service";
import type { PaymentTransactionDTO } from '@/server/types/dto/v1/payment-transaction.dto'

export const usePaymentTransaction = () => {
  const listPaymentStatus = ref<PaymentTransactionDTO[]>([])

  const fetchPaymentStatus = async () => {
    try {
      const data = await ordersAPI.getAll()
      listPaymentStatus.value = data.data;
    } catch (err) {
      console.error('Error payment status', err)
    }
  }

  const getPaymentStatusItem = (id: string) => {
    if(listPaymentStatus.value.length === 0) fetchPaymentStatus()
    return listPaymentStatus.value.find(item => item.id === id)
  }

  const getListPaymentStatus = computed(() => listPaymentStatus.value);

  return {
    fetchPaymentStatus,
    getPaymentStatusItem,
    getListPaymentStatus
  }
}