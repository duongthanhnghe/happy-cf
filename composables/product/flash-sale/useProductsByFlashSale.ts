import { computed } from 'vue'
import { useState } from 'nuxt/app'
import { productsAPI } from '@/services/v1/product.service'
import type { PaginationDTO } from '@/server/types/common/pagination.dto'
import type { FlashSaleProductDTO } from '@/server/types/dto/v1/flash-sale.dto'

export const useProductsByFlashSale = () => {
  const listData = useState<PaginationDTO<FlashSaleProductDTO> | null>(
    'flash-sale-products',
    () => null
  )

  const loadingData = useState<boolean>(
    'flash-sale-products-loading',
    () => false
  )

  const fetchProductsByFlashSale = async (
    flashSaleId: string,
    page = 1,
    limit = 20
  ) => {
    try {
      loadingData.value = true

      const data = await productsAPI.getProductsByFlashSale(
        flashSaleId,
        page,
        limit
      )

      if (data.code === 0) {
        listData.value = data
      }
    } catch (err) {
      console.error('Error fetchProductsByFlashSale', err)
    } finally {
      loadingData.value = false
    }
  }

  const getProductsByFlashSale = computed(() => listData.value)

  return {
    fetchProductsByFlashSale,
    getProductsByFlashSale,
    listData,
    loadingData
  }
}