import { ref, computed } from "vue";
import { newsAPI } from "@/services/news.service";
import type { CategoryNewsDTO } from '@/server/types/dto/news.dto';

export const useNewsCategoryDetail = () => {
  const detailData = ref<CategoryNewsDTO|null>(null);

  const fetchDetailNewsCategory = async (id: string) => {
    try {
      const data = await newsAPI.getCategoryById(id)
      if(data.code === 0) detailData.value = data.data;
    } catch (err) {
      console.error('Error category news detail', err)
    }
  }

  const getDetailNewsCategoryApi = computed(() => detailData.value);

  return {
    fetchDetailNewsCategory,
    getDetailNewsCategoryApi
  }
}