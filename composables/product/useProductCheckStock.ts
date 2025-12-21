import { ref } from 'vue'
import { productsAPI } from '@/services/v1/product.service'
import { Loading } from '@/utils/global'

interface CheckStockPayload {
  productId: string
  quantity: number
  combinationId?: string
}

export const useProductCheckStock = () => {
  const loading = ref(false)
  const availableStock = ref<number | null>(null)

    const checkStock = async (payload: CheckStockPayload): Promise<boolean> => {
    loading.value = true
    Loading(true)

    try {
      const apiPayload: CheckStockPayload = {
        productId: payload.productId,
        quantity: payload.quantity
      }

      if (payload.combinationId) {
        apiPayload.combinationId = payload.combinationId
      }

      const res = await productsAPI.checkProductStock(apiPayload)

      if (res.code !== 0) {
        availableStock.value = res.availableStock ?? 0
        return false
      }

      availableStock.value = res.availableStock
      return true
    } catch (err) {
      console.error('Check stock error:', err)
      return false
    } finally {
      loading.value = false
      Loading(false)
    }
  }

  return {
    checkStock,
    loading,
    availableStock,
  }
}
