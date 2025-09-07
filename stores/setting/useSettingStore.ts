import { ref, computed, onMounted } from "vue"
import { defineStore } from "pinia"
import Facebook from "@/components/icons/Facebook.vue"
import Instagram from "@/components/icons/Instagram.vue"
import Tiktok from "@/components/icons/Tiktok.vue"

const CACHE_TTL = 60 * 60 * 1000

export const useSettingStore = defineStore("SettingStore", () => {
  const detailData = ref<any | null>(null)
  const lastFetched = ref<number | null>(null)

  const fetchSetting = async (force = false) => {
    try {
      const now = Date.now()

      if (!force && detailData.value && lastFetched.value && (now - lastFetched.value < CACHE_TTL)) {
        return
      }

      const res = await fetch("/data/settings.json")
      const json = await res.json()
      detailData.value = json
      lastFetched.value = now
    } catch (err) {
      console.error("Error loading settings", err)
    }
  }

  const getSettings = computed(() => detailData.value)

  const iconMap: Record<string, any> = {
    Facebook,
    Instagram,
    Tiktok,
  }

  onMounted(() => {
    if (process.client) {
      if (!detailData.value) {
        fetchSetting(true)
      } else {
        const now = Date.now()
        if (!lastFetched.value || (now - lastFetched.value > CACHE_TTL)) {
          fetchSetting(true)
        }
      }
    }
  })

  return {
    detailData,
    lastFetched,
    fetchSetting,
    getSettings,
    iconMap,
  }
}, {
  persist: {
    key: 'SettingStore',
    storage: typeof window !== 'undefined' ? localStorage : undefined,
    paths: ['detailData', 'lastFetched'],
  }
})
