import { ref, computed } from "vue";
import { bannersAPI } from "@/services/v1/banner.service";
import type { BannerDTO } from '@/server/types/dto/v1/banner.dto'

export const useBanner = () => {
  const listBanner = ref<BannerDTO[] | []>([])

  const fetchBanner = async () => {
    try {
      const data = await bannersAPI.getAll()
      if(data.code === 0){
        listBanner.value = data.data
        return data.data
      }
    } catch (err) {
      console.error('Error banner', err)
    }
  }

  const getListBanner = computed(() => listBanner.value);

  return {
    listBanner,
    fetchBanner,
    getListBanner
  }
}