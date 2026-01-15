import { computed } from "vue";
import { ordersAPI } from "@/services/v1/orders.service";
import type { PaymentDTO } from '@/server/types/dto/v1/order.dto'
import { useState } from "nuxt/app";

export const usePaymentStatus = () => {
  const listPaymentStatus = useState<PaymentDTO[]>('list-payment-status', () => [])

  const fetchPaymentStatus = async () => {
    try {
      const data = await ordersAPI.getAllPayment()
      listPaymentStatus.value = data.data;
    } catch (err) {
      console.error('Error payment status', err)
    }
  }

  const getListPaymentStatus = computed(() => listPaymentStatus.value);

  return {
    listPaymentStatus,
    fetchPaymentStatus,
    getListPaymentStatus
  }
}