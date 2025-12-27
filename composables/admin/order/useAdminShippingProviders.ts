import type { ShippingProviderDTO } from '@/server/types/dto/v1/order.dto'
import { ordersAPI } from '@/services/v1/admin/orders.service'
import { ref, computed } from 'vue'

export const useAdminShippingProviders = () => {

  const shippingProviders = ref<ShippingProviderDTO[]>([])
  const shippingProviderDetail = ref<ShippingProviderDTO | null>(null)
  const loading = ref(false)

  const fetchAllShippingProviders = async (active?: boolean) => {
    try {
      loading.value = true
      const res = await ordersAPI.getAllShippingProviders(active)
      if (res.code === 0) {
        shippingProviders.value = res.data
      }
    } catch (err) {
      console.error('Error fetch shipping providers', err)
    } finally {
      loading.value = false
    }
  }

  const fetchShippingProviderDetail = async (id: string) => {
    try {
      loading.value = true
      const res = await ordersAPI.getShippingProviderDetail(id)
      if (res.code === 0) {
        shippingProviderDetail.value = res.data
      }
    } catch (err) {
      console.error('Error fetch shipping provider detail', err)
    } finally {
      loading.value = false
    }
  }

  const getShippingProviders = computed(() => shippingProviders.value)
  const getShippingProviderDetail = computed(() => shippingProviderDetail.value)

  return {
    shippingProviders,
    shippingProviderDetail,
    loading,
    fetchAllShippingProviders,
    fetchShippingProviderDetail,
    getShippingProviders,
    getShippingProviderDetail
  }
}
