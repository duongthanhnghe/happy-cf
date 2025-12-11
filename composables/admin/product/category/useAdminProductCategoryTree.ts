import { ref, computed } from "vue";
import { categoriesAPI } from "@/services/v1/admin/categories-product.service";
import type { CategoryProductDTO } from '@/server/types/dto/v1/product.dto'

export const useAdminProductCategoryTree = () => {
  
  const listCategory = ref<CategoryProductDTO[]>([])
  
  const fetchCategoryListTree = async () => {
    try {
      const data = await categoriesAPI.getAllTree()
      if(data.code === 0) listCategory.value = data.data
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const getListCategoryAllTree = computed(() => listCategory.value )

  return {
   fetchCategoryListTree,
   getListCategoryAllTree
  }
}