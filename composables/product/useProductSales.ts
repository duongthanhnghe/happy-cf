import { computed } from "vue";
import { productsAPI } from "@/services/v1/product.service";
import type { ProductPaginationDTO, ProductSortType } from '@/server/types/dto/v1/product.dto';
import { useState } from "nuxt/app";

export const useProductSales = () => {
  const listData = useState<ProductPaginationDTO | null>('product-sale-list', () => null)
  const loadingData = useState<boolean>(
  'product-sale-loading',
  () => false
)

  const fetchListProductSales = async (categoryId: string, page: number, limit: number, filter: ProductSortType) => {
    try {
      loadingData.value = true
      const data = await productsAPI.getPromotional(categoryId, page, limit, filter)
      if(data.code === 0) {
        listData.value = data
      }
    } catch (err) {
      console.error('Error most promotion', err)
    } finally {
      loadingData.value = false
    }
  }

  const getListProductSales = computed(() => listData.value);

  return {
    fetchListProductSales,
    getListProductSales,
    listData,
    loadingData
  }
}