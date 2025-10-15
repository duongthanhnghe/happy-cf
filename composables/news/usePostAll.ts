import { ref, computed } from "vue";
import { newsAPI } from "@/services/v1/news.service";
import type { PostNewsPaginationDTO } from '@/server/types/dto/v1/news.dto'

export const usePostAll = () => {
  
  const listData = ref<PostNewsPaginationDTO>()

  const fetchPostList = async (page: number, limit: number) => {
    try {
      const data: PostNewsPaginationDTO = await newsAPI.getAllPosts(page, limit)
      if(data.code === 0) listData.value = data
    } catch (error) {
      console.error("Error fetching post:", error)
    }
  }

  const getListPostApi = computed(() => listData.value)

  return {
   fetchPostList,
   getListPostApi,
  }
}