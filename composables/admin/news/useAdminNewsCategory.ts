import { ref, computed } from "vue";
import { newsAPI } from "@/services/v1/admin/news.service";
import type { CategoryNewsPaginationDTO } from '@/server/types/dto/v1/news.dto'

export const useAdminNewsCategory = () => {
  
  const listCategory = ref<CategoryNewsPaginationDTO|null>(null)
  
  const fetchCategoryList = async (page: number, limit: number,search: string) => {
    try {
      const data = await newsAPI.getAllCategories(page,limit,search)
      if(data.code === 0) listCategory.value = data
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const getListCategoryApi = computed(() => listCategory.value)

  return {
   listCategory,
   fetchCategoryList,
   getListCategoryApi,
  }
}