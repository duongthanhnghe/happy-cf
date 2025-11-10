import { ref, computed } from "vue";
import { newsAPI } from "@/services/v1/news.service";
import { useState } from "nuxt/app";
import type { PostNewsDTO } from '@/server/types/dto/v1/news.dto'

export const usePostRelated = () => {
  const listData = useState<PostNewsDTO[] | null>('post-news-related', () => null)
  const loading = ref(false);
  
  const fetchPostListRelated = async (slug: string, limit: number) => {
    loading.value = true;

    try {
      const data = await newsAPI.getRelatedPosts(slug,limit)
      if(data.code === 0) listData.value = data.data
    } catch (error) {
      console.error("Error fetching post:", error)
    } finally {
      loading.value = false;
    }
  }

  const getListPostRelatedApi = computed(() => listData.value)

  return {
  loading,
   fetchPostListRelated,
   getListPostRelatedApi,
  }
}