import { ref, computed } from "vue";
import { ordersAPI } from "@/services/orders.service";
import type { PaymentDTO } from '@/server/types/dto/order.dto'

export const usePaymentStatus = () => {
  const listPaymentStatus = ref<PaymentDTO[]>([])

  const fetchPaymentStatus = async () => {
    try {
      const data = await ordersAPI.getAllPayment()
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
    listPaymentStatus,
    fetchPaymentStatus,
    getPaymentStatusItem,
    getListPaymentStatus
  }
}