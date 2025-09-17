import { ref, computed, markRaw } from "vue"
import { defineStore } from "pinia"
import Facebook from "@/components/atoms/icons/Facebook.vue"
import Instagram from "@/components/atoms/icons/Instagram.vue"
import Tiktok from "@/components/atoms/icons/Tiktok.vue"

const CACHE_TTL = 3 * 24 * 60 * 60 * 1000

export const useSettingStore = defineStore("SettingStore", () => {
  const detailData = ref<any | null>(null)
  const lastFetched = ref<number | null>(null)

  const fetchSetting = async (force = false) => {
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
      const configRuntime = useRuntimeConfig()
      const res = await $fetch(`${configRuntime.public.siteUrl}/data/settings.json`)
      detailData.value = res
      lastFetched.value = now
      return detailData.value
    } catch (err) {
      console.error("Error loading settings", err)
      return null
    }
  }

  const getSettings = computed(() => detailData.value)

  const iconMap: Record<string, any> = {
    Facebook: markRaw(Facebook),
    Instagram: markRaw(Instagram),
    Tiktok: markRaw(Tiktok),
  }

  return {
    detailData,
    lastFetched,
    fetchSetting,
    getSettings,
    iconMap,
  }
})
