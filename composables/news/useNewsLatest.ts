import { ref, computed } from "vue";
import type { PostNewsDTO } from '@/server/types/dto/v1/news.dto'
import { newsAPI } from "@/services/v1/news.service";
export const useNewsLatest = () => {

  const dataListNewsLatest = ref<PostNewsDTO[]>([]);

  const getApiListNewsLatest = async (limit: number) => {
    try {
      const data = await newsAPI.getLatestPosts(limit)
      if(data.code === 0){
        dataListNewsLatest.value = data.data
      }
    } catch (err) {
      console.error('Error most order', err)
    }
  }

  const getListNewsLatest = computed(() => dataListNewsLatest.value);

  return {
    getApiListNewsLatest,
    getListNewsLatest
  }
}