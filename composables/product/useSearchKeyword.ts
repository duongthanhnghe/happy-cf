import { ref, computed } from "vue";
import { usersAPI } from "@/services/v1/users.service";
import type { SearchKeywordDTO } from '@/server/types/dto/v1/search-keyword.dto'

export const useSearchKeyword = () => {
  const listSearchKeyword = ref<SearchKeywordDTO[]|[]>([]);

  const fetchSearchKeyword = async (limit: number) => {
    try {
      const data = await usersAPI.getTopSearchKeyword(limit)
      if(data.code === 0) {
        listSearchKeyword.value = data.data
      }
    } catch (err) {
      console.error('Error most order', err)
    }
  }

  const fetchLogSearchKeyword = async (keyQuery: string) => {
    try {
      await usersAPI.logSearchKeyword(keyQuery)
    } catch (err) {
      console.warn('Không log được từ khóa:', keyQuery)
    }
  }

  const getListSearchKeyword = computed(() => listSearchKeyword.value);

  return {
    listSearchKeyword,
    fetchSearchKeyword,
    getListSearchKeyword,
    fetchLogSearchKeyword,
  }
}