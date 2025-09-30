import { ref, computed } from "vue";
import { categoriesAPI } from "@/services/categories-product.service";
import type { CategoryProductDTO } from '@/server/types/dto/product.dto'

export const useProductCategoryTree = () => {
  
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
  const getListCategoryTree = computed(() => listCategory.value?.filter((item) => item.isActive === true ))

  return {
   fetchCategoryListTree,
   getListCategoryTree,
   getListCategoryAllTree
  }
}