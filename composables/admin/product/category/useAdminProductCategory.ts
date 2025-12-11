import { ref, computed } from "vue";
import { categoriesAPI } from "@/services/v1/admin/categories-product.service";
import type { CategoryProductPaginationDTO } from '@/server/types/dto/v1/product.dto'

export const useAdminProductCategory = () => {
  
  const listCategory = ref<CategoryProductPaginationDTO>()
  
  const fetchCategoryList = async (page:number,limit:number,search: string) => {
    try {
      const data = await categoriesAPI.getAll(page,limit,search)
      if(data.code === 0) listCategory.value = data
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