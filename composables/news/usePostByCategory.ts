import { ref, computed } from "vue";
import { newsAPI } from "@/services/v1/news.service";
import { useState } from "nuxt/app";

export const usePostByCategory = () => {
  const listData = useState<any | null>('news-category-by-post', () => null)
  const loading = ref(false);
  
  const fetchPostByCategory = async (id: string, page: number, limit: number) => {
    loading.value = true;
    try {
      const data = await newsAPI.getPostsByCategory(id, page, limit)
      if(data.code === 0){
        listData.value = data
      } 
    } catch (error) {
      console.error("Error fetching post:", error)
      return []
    } finally {
      loading.value = false;
    }
  }

  const getPostByCategoryApi = computed(() => listData.value)

  return {
  loading,
   fetchPostByCategory,
   getPostByCategoryApi,
  }
}