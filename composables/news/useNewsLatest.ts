import { ref, computed } from "vue";
import type { PostNewsDTO } from '@/server/types/dto/news.dto'
import { newsAPI } from "@/services/news.service";
export const useNewsLatest = () => {

  const dataListNewsLatest = ref<{ data: PostNewsDTO[] } | null>(null);
  const limitListNewsLatest = ref<number>(5)

  const getApiListNewsLatest = async () => {
    try {
      const data = await newsAPI.getLatestPosts(limitListNewsLatest.value)
      dataListNewsLatest.value = data
    } catch (err) {
      console.error('Error most order', err)
    }
  }

  const getListNewsLatest = computed(() => dataListNewsLatest.value?.data);

  return {
    dataListNewsLatest,
    limitListNewsLatest,
    getApiListNewsLatest,
    getListNewsLatest
  }
}