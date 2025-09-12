import { ref, computed } from "vue";
import { categoriesAPI } from "@/services/categories-product.service";
import type { CategoryProductDTO } from '@/server/types/dto/product.dto'
import { useState } from "nuxt/app";

export const useProductCategoryDetail = () => {
  
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

  const fetchProductCategoryDetailSlug = async (slug: string) => {
    try {
      const data = await categoriesAPI.getDetailBySlug(slug)
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
   fetchProductCategoryDetailSlug,
   getProductCategoryDetail
  }
}