import { ref, computed } from "vue";
import { newsAPI } from "@/services/news.service";
import type { PostNewsDTO } from '@/server/types/dto/news.dto';

export const usePostDetail = () => {
  const detailData = ref<PostNewsDTO|null>(null);

  const fetchDetailPost = async (id: string) => {
    try {
      const data = await newsAPI.getPostById(id)
      if(data.code === 0) detailData.value = data.data;
    } catch (err) {
      console.error('Error product detail', err)
    }
  }

  const getDetailPostApi = computed(() => detailData.value);

  return {
    fetchDetailPost,
    getDetailPostApi
  }
}