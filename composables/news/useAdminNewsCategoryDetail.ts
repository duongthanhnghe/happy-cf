import { ref, computed } from "vue";
import { useState } from "nuxt/app";
import { newsAPI } from "@/services/v1/admin/news.service";
import type { CategoryNewsDTO } from '@/server/types/dto/v1/news.dto';

export const useAdminNewsCategoryDetail = () => {
  const detailData = useState<CategoryNewsDTO | null>('news-category-detail', () => null)

  const fetchDetailNewsCategory = async (id: string) => {
    try {
      const data = await newsAPI.getCategoryById(id)
      if(data.code === 0) {
        detailData.value = data.data;
      }
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