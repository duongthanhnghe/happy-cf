import { ref, computed } from "vue";
import { useState } from "nuxt/app";
import { newsAPI } from "@/services/news.service";
import type { CategoryNewsDTO } from '@/server/types/dto/news.dto';

export const useNewsCategoryDetail = () => {
  // const detailData = ref<CategoryNewsDTO|null>(null);
  const detailData = useState<CategoryNewsDTO | null>('news-category-detail', () => null)

  //fetch theo id
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

  //fetch theo slug
  const fetchDetailNewsCategorySlug = async (slug: string) => {
    try {
      const data = await newsAPI.getCategoryBySlug(slug)
      if(data.code === 0) {
        detailData.value = data.data;
        return data
      }
    } catch (err) {
      console.error('Error category news detail', err)
    }
  }

  const getDetailNewsCategoryApi = computed(() => detailData.value);

  return {
    fetchDetailNewsCategory,
    fetchDetailNewsCategorySlug,
    getDetailNewsCategoryApi
  }
}