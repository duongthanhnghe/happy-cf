import { computed } from 'vue'
import { useState } from 'nuxt/app'
import { productsAPI } from '@/services/v1/product.service'
import type { ProductWithFlashSale } from '@/server/types/dto/v1/product.dto'

export const useAllFlashSalesWithProducts = () => {
  const listData = useState<ProductWithFlashSale[]>(
    'all-flash-sales-with-products',
    () => []
  )

  const loadingData = useState<boolean>(
    'all-flash-sales-with-products-loading',
    () => false
  )

  const fetchAllFlashSalesWithProducts = async () => {
    try {
      loadingData.value = true

      const res = await productsAPI.getAllFlashSaleProducts()

      if (res.code === 0 && Array.isArray(res.data)) {
        listData.value = res.data
      } else {
        listData.value = []
      }
    } catch (err) {
      console.error('Error fetchAllFlashSalesWithProducts', err)
      listData.value = []
    } finally {
      loadingData.value = false
    }
  }

  const getAllFlashSalesWithProducts = computed(() => listData.value)

  return {
    fetchAllFlashSalesWithProducts,
    getAllFlashSalesWithProducts,
    loadingData
  }
}
