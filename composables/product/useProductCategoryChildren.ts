import { ref, computed } from "vue";
import { categoriesAPI } from "@/services/v1/categories-product.service";
import type { CategoryProductDTO } from '@/server/types/dto/v1/product.dto'
import { useState } from "nuxt/app";

export const useProductCategoryChildren = () => {
  
  const listCategory = useState<CategoryProductDTO[]>('product-category-children', () => [])
  
  const fetchCategoryChildrenList = async (parentId: string, includeInactive: boolean) => {
    try {
      const data = await categoriesAPI.getChildren(parentId,includeInactive)
      if(data.code === 0) {
        listCategory.value = data.data
        return data.data
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const getListCategoryChildren = computed(() => listCategory.value )

  return {
   fetchCategoryChildrenList,
   getListCategoryChildren,
  }
}