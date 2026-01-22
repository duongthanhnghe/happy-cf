import { productsAPI } from '@/services/v1/admin/product.service'
import type { ProductDTO } from '@/server/types/dto/v1/product.dto'
import { useState } from 'nuxt/app'

export const useAdminProductDetailMap = () => {
  const productMap = useState<Record<string, ProductDTO>>(
    'product-detail-map',
    () => ({})
  )

  const fetchDetailProduct = async (id: string) => {
    if (!id || productMap.value[id]) return

    const res = await productsAPI.getDetail(id)
    if (res.code === 0) {
      productMap.value[id] = res.data
    }
  }

  const getProductDetail = (id: string) => {
    return productMap.value[id]
  }

  const resetProductCache = () => {
    productMap.value = {}
  }

  return {
    fetchDetailProduct,
    getProductDetail,
    resetProductCache,
  }
}

