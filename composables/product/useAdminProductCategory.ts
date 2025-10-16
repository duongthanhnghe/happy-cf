import { ref, computed } from "vue";
import { categoriesAPI } from "@/services/v1/admin/categories-product.service";
import type { CategoryProductDTO } from '@/server/types/dto/v1/product.dto'

export const useAdminProductCategory = () => {
  
  const listCategory = ref<CategoryProductDTO[]>([])
  
  const fetchCategoryList = async () => {
    try {
      const data = await categoriesAPI.getAll()
      if(data.code === 0) listCategory.value = data.data
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const getListCategoryAll = computed(() => listCategory.value )

  return {
   listCategory,
   fetchCategoryList,
   getListCategoryAll
  }
}