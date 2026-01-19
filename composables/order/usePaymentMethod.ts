import { computed } from "vue";
import { ordersAPI } from "@/services/v1/orders.service";
import type { PaymentDTO } from '@/server/types/dto/v1/order.dto'
import { useState } from "nuxt/app";

export const usePaymentMethod = () => {
  const listData = useState<PaymentDTO[]>('list-payment-method', () => [])

  const fetchPaymentMethod = async () => {
    try {
      const data = await ordersAPI.getAllPayment()
      listData.value = data.data;
    } catch (err) {
      console.error('Error payment method', err)
    }
  }

  const getListPaymentMethod = computed(() => listData.value);

  return {
    fetchPaymentMethod,
    getListPaymentMethod
  }
}