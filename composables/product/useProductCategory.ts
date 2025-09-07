import { ref, computed } from "vue";
import { categoriesAPI } from "@/services/categories-product.service";
import type { CategoryProductDTO } from '@/server/types/dto/product.dto'

export const useProductCategory = () => {
  
  const listCategory = ref<CategoryProductDTO[]|null>(null)
  
  const fetchCategoryList = async () => {
    try {
      const data = await categoriesAPI.getAll()
      if(data.code === 0) listCategory.value = data.data
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const getListCategoryAll = computed(() => listCategory.value )
  const getListCategory = computed(() => listCategory.value?.filter((item) => item.isActive === true ))

  return {
   listCategory,
   fetchCategoryList,
   getListCategory,
   getListCategoryAll
  }
}