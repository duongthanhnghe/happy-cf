import { ref, computed } from "vue";
import { newsAPI } from "@/services/news.service";
import type { CategoryNewsDTO } from '@/server/types/dto/news.dto'

export const useNewsCategory = () => {
  
  const listCategory = ref<CategoryNewsDTO[]>([])
  
  const fetchCategoryList = async () => {
    try {
      const data = await newsAPI.getAllCategories()
      if(data.code === 0) listCategory.value = data.data
    } catch (error) {
      console.error("Error fetching categories:", error)
    }
  }

  const getListCategoryApi = computed(() => listCategory.value)
  const getListCategoryActiveApi = computed(() => listCategory.value?.filter((item) => item.isActive === true ))

  return {
   listCategory,
   fetchCategoryList,
   getListCategoryApi,
   getListCategoryActiveApi
  }
}