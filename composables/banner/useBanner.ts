import { ref, computed } from "vue";
import { bannersAPI } from "@/services/banner.service";
import type { BannerDTO } from '@server/types/dto/banner.dto'

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

  const getListBanner = computed(() => listBanner.value?.filter(banner => banner.isActive));

  return {
    listBanner,
    fetchBanner,
    getListBanner
  }
}