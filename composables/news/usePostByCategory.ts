import { ref, computed } from "vue";
import { newsAPI } from "@/services/v1/news.service";
import type { PostNewsDTO } from '@/server/types/dto/v1/news.dto'
import { useState } from "nuxt/app";

export const usePostByCategory = () => {
  
  // const listData = ref<PostNewsDTO[]>([])
  const listData = useState<any | null>('news-category-by-post', () => null)
  
  
  const fetchPostByCategory = async (id: string, page: number, limit: number) => {
    try {
      const data = await newsAPI.getPostsByCategory(id, page, limit)
      if(data.code === 0) listData.value = data
      // console.log("listData.value")
      // console.log(listData.value)
    } catch (error) {
      console.error("Error fetching post:", error)
    }
  }

  const getPostByCategoryApi = computed(() => listData.value)

  return {
   fetchPostByCategory,
   getPostByCategoryApi,
  }
}