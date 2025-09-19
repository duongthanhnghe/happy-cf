import { ref, computed } from "vue";
import { categoriesAPI } from "@/services/categories-product.service";
import type { ProductPaginationDTO, ProductSortType } from '@/server/types/dto/product.dto'
import { useState } from "nuxt/app";

export const useProductByCategory = () => {
  
  const listData = useState<ProductPaginationDTO | null>('product-by-category', () => null)
  
  const fetchProductByCategory = async (id: string, page: number, limit: number, filter: ProductSortType) => {
    try {
      const data = await categoriesAPI.getListByCategory(id, page, limit, filter)
      if(data.code === 0) listData.value = data
    } catch (error) {
      console.error("Error fetching product:", error)
    }
  }

  const getProductByCategoryApi = computed(() => listData.value)

  return {
   fetchProductByCategory,
   getProductByCategoryApi,
  }
}