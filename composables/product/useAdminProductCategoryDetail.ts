import { ref, computed } from "vue";
import { categoriesAPI } from "@/services/v1/admin/categories-product.service";
import type { CategoryProductDTO } from '@/server/types/dto/v1/product.dto'
import { useState } from "nuxt/app";

export const useAdminProductCategoryDetail = () => {
  
  const detailData = useState<CategoryProductDTO | null>('product-category-detail', () => null)
  
  const fetchProductCategoryDetail = async (id: string) => {
    try {
      const data = await categoriesAPI.getDetail(id)
      if(data.code === 0){
        detailData.value = data.data
        return data
      } 
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const getProductCategoryDetail = computed(() => detailData.value )

  return {
   fetchProductCategoryDetail,
   getProductCategoryDetail
  }
}