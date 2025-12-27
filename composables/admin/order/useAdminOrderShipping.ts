import type { OrderShippingDTO } from '@/server/types/dto/v1/order.dto'
import { ordersAPI } from '@/services/v1/admin/orders.service'
import { ref, computed } from 'vue'

export const useAdminOrderShipping = () => {

  const orderShippingDetail = ref<OrderShippingDTO | null>(null)
  const loading = ref(false)

  const fetchOrderShippingDetail = async (orderId: string) => {
    try {
      loading.value = true
      const res = await ordersAPI.getOrderShippingDetail(orderId)

      if (res.code === 0) {
        orderShippingDetail.value = res.data
      }
    } catch (err) {
      console.error('Error fetch order shipping detail', err)
    } finally {
      loading.value = false
    }
  }

  const getOrderShippingDetail = computed(() => orderShippingDetail.value)

  return {
    loading,
    fetchOrderShippingDetail,
    getOrderShippingDetail
  }
}
