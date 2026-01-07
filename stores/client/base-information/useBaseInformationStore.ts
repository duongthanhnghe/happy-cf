import { ref, computed, markRaw } from "vue"
import { defineStore } from "pinia"
import { baseInformationAPI } from "@/services/v1/base-information.service"
import Facebook from "@/components/atoms/icons/Facebook.vue"
import Instagram from "@/components/atoms/icons/Instagram.vue"
import Tiktok from "@/components/atoms/icons/Tiktok.vue"
import type { BaseInformationDTO } from "@/server/types/dto/v1/base-information.dto";

const CACHE_TTL = 3 * 24 * 60 * 60 * 1000 // 3 ngày

export const useBaseInformationStore = defineStore("BaseInformationStore", () => {
  const detailData = ref<BaseInformationDTO | null>(null)
  const lastFetched = ref<number | null>(null)

  const fetchBaseInformation = async (force = false) => {
    const now = Date.now()

    if (
      !force &&
      detailData.value &&
      lastFetched.value &&
      now - (lastFetched.value ?? 0) < CACHE_TTL
    ) {
      return detailData.value
    }

    try {
      const res = await baseInformationAPI.getBaseInformation()
      if (res.code === 0) {
        detailData.value = res.data
        lastFetched.value = now
      } else {
        console.error("Error loading base information:", res.message)
      }
      return detailData.value
    } catch (err) {
      console.error("Error fetching base information:", err)
      return null
    }
  }

  const getBaseInformation = computed(() => detailData.value)

  const iconMap: Record<string, any> = {
    Facebook: markRaw(Facebook),
    Instagram: markRaw(Instagram),
    Tiktok: markRaw(Tiktok),
  }

  return {
    detailData,
    lastFetched,
    fetchBaseInformation,
    getBaseInformation,
    iconMap,
  }
})
