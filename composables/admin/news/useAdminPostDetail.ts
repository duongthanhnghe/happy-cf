import { ref, computed } from "vue";
import { newsAPI } from "@/services/v1/admin/news.service";
import type { PostNewsDTO } from '@/server/types/dto/v1/news.dto';
import { useState } from "nuxt/app";

export const useAdminPostDetail = () => {
  const detailData = useState<PostNewsDTO | null>('post-news-detail', () => null)

  const fetchDetailPost = async (id: string) => {
    try {
      const data = await newsAPI.getPostById(id)
      if(data.code === 0) detailData.value = data.data;
    } catch (err) {
      console.error('Error news detail', err)
    }
  }
  const getDetailPostApi = computed(() => detailData.value);

  return {
    fetchDetailPost,
    getDetailPostApi
  }
}