import { ref, computed } from "vue";
import { newsAPI } from "@/services/news.service";
import type { PostNewsDTO } from '@/server/types/dto/news.dto'

export const usePostAll = () => {
  
  const listData = ref<PostNewsDTO[]>([])
  
  const fetchPostList = async () => {
    try {
      const data = await newsAPI.getAllPosts()
      if(data.code === 0) listData.value = data.data
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