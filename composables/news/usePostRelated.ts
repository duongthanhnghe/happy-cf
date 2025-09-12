import { ref, computed } from "vue";
import { newsAPI } from "@/services/news.service";
import type { PostNewsDTO } from '@/server/types/dto/news.dto'
import { useState } from "nuxt/app";

export const usePostRelated = () => {
  // const listData = ref<PostNewsDTO[]>([])
  const listData = useState<PostNewsDTO[] | null>('post-news-related', () => null)
  
  const fetchPostListRelated = async (slug: string, limit: number) => {
    try {
      const data = await newsAPI.getRelatedPosts(slug,limit)
      if(data.code === 0) listData.value = data.data
    } catch (error) {
      console.error("Error fetching post:", error)
    }
  }

  const getListPostRelatedApi = computed(() => listData.value)

  return {
   fetchPostListRelated,
   getListPostRelatedApi,
  }
}