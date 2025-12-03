import { ref, computed } from "vue";
import { newsAPI } from "@/services/v1/news.service";
import type { CategoryNewsDTO } from '@/server/types/dto/v1/news.dto'
import { useState } from "nuxt/app";

export const useCategoryList = () => {
  
  const listCategory = useState<CategoryNewsDTO[]>('news-category-list', () => [])
  const loading = ref<boolean>(false)
  
  const fetchCategoryList = async () => {
    loading.value = true
    try {
      const data = await newsAPI.getAllCategories()
      if(data.code === 0) listCategory.value = data.data
    } catch (error) {
      console.error("Error fetching categories:", error)
    } finally {
      loading.value = false
    }
  }

  const getListCategory = computed(() => listCategory.value)

  return {
    loading,
    listCategory,
    fetchCategoryList,
    getListCategory,
  }
}