import { computed } from "vue";
import { ordersAPI } from "@/services/v1/admin/orders.service";
import type { PaymentDTO } from '@/server/types/dto/v1/order.dto'
import { useState } from "nuxt/app";

export const usePaymentMethod = () => {
  const listPayment = useState<PaymentDTO[]>('admin-list-payment-method', () => [])

  const fetchPaymentMethod = async () => {
    try {
      const data = await ordersAPI.getAllPayment()
      listPayment.value = data.data;
    } catch (err) {
      console.error('Error payment', err)
    }
  }

  const getListPayment = computed(() => listPayment.value);

  return {
    listPayment,
    fetchPaymentMethod,
    getListPayment
  }
}