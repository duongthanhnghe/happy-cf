import { computed } from "vue";
import { productsAPI } from "@/services/v1/product.service";
import type { ProductPaginationDTO, ProductSortType } from '@/server/types/dto/v1/product.dto';
import { useState } from "nuxt/app";

export const useProductMostOrder = () => {
  const listData = useState<ProductPaginationDTO | null>('product-most-order-list', () => null)
  const loadingData = useState<boolean>(
  'product-most-order-loading',
  () => false
)

  const fetchListProductMostOrder = async (categoryId: string, page: number, limit: number, filter: ProductSortType) => {
    try {
      loadingData.value = true
      const data = await productsAPI.getMostOrdered(categoryId, page, limit, filter)
      if(data.code === 0) {
        listData.value = data
      }
    } catch (err) {
      console.error('Error most promotion', err)
    } finally {
      loadingData.value = false
    }
  }

  const getListProductMostOrder = computed(() => listData.value);

  return {
    fetchListProductMostOrder,
    getListProductMostOrder,
    listData,
    loadingData
  }
}