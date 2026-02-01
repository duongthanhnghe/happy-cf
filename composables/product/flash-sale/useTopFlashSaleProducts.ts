import { computed } from 'vue'
import { useState } from 'nuxt/app'
import { productsAPI } from '@/services/v1/product.service'
import type { ProductDTO } from '@/server/types/dto/v1/product.dto'

export const useTopFlashSaleProducts = () => {
  const listData = useState<ProductDTO[]>(
    'flash-sale-top-products',
    () => []
  )

  const loadingData = useState<boolean>(
    'flash-sale-top-products-loading',
    () => false
  )

  const fetchTopFlashSaleProducts = async () => {
    try {
      loadingData.value = true
      const res = await productsAPI.getTopFlashSaleProducts()

      if (res.code === 0) {
        listData.value = res.data
      } else {
        listData.value = []
      }
    } catch (err) {
      console.error('Error fetchTopFlashSaleProducts', err)
      listData.value = []
    } finally {
      loadingData.value = false
    }
  }

  const getTopFlashSaleProducts = computed(() => listData.value)

  return {
    fetchTopFlashSaleProducts,
    getTopFlashSaleProducts,
    loadingData
  }
}