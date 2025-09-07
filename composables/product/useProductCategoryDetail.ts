import { ref, computed } from "vue";
import { categoriesAPI } from "@/services/categories-product.service";
import type { CategoryProductDTO } from '@/server/types/dto/product.dto'

export const useProductCategoryDetail = () => {
  
  const detailData = ref<CategoryProductDTO|null>(null)
  
  const fetchProductCategoryDetail = async (id: string) => {
    try {
      const data = await categoriesAPI.getDetail(id)
      if(data.code === 0) detailData.value = data.data
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