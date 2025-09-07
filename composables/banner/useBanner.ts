import { ref, computed } from "vue";
import { bannersAPI } from "@/services/banner.service";
import type { BannerDTO } from '@server/types/dto/banner.dto'

export const useBanner = () => {
  const listBanner = ref<{ data: BannerDTO[] } | null>(null)

  const fetchBanner = async () => {
    try {
      const data = await bannersAPI.getAll()
      listBanner.value = data
    } catch (err) {
      console.error('Error banner', err)
    }
  }

  const getListBanner = computed(() => listBanner.value?.data.filter(banner => banner.isActive));

  return {
    listBanner,
    fetchBanner,
    getListBanner
  }
}