import { ref, computed } from 'vue'
import { ordersAPI } from '@/services/v1/orders.service'
import type { OrderStatusCountDTO } from '@/server/types/dto/v1/order.dto'

export const useOrderCountByStatus = () => {

  const orderStatusCounts = ref<OrderStatusCountDTO[]>([])
  const loading = ref(false)

  const fetchOrderCountByStatus = async () => {
    try {
      loading.value = true
      const res = await ordersAPI.getOrderCountByStatusByUser()
      if (res.code === 0) {
        orderStatusCounts.value = res.data
      }
    } catch (err) {
      console.error('Error fetch order count by status', err)
    } finally {
      loading.value = false
    }
  }

  const getOrderStatusCounts = computed(() => orderStatusCounts.value)

  return {
    orderStatusCounts,
    loading,
    fetchOrderCountByStatus,
    getOrderStatusCounts,
  }
}
