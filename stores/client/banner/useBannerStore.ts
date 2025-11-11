import { ref } from "vue";
import { defineStore } from "pinia";
import { useBanner } from '@/composables/banner/useBanner';

const TTL_MS = 10 * 60 * 1000

export const useBannerStore = defineStore("BannerStore", () => {
  const { fetchBanner, getListBanner } = useBanner();
  const lastFetched = ref<number | null>(null)
  const loading = ref(false)

  const fetchBannerStore = async () => {
    const now = Date.now()
    if (getListBanner.value.length > 0 && lastFetched.value && now - lastFetched.value < TTL_MS) return

    loading.value = true
    try {
      await fetchBanner()
      lastFetched.value = now
    } finally {
      loading.value = false
    }
  }
  
  return {
    loading,
    fetchBannerStore,
    getListBanner,
    lastFetched,
  };
}, {
  persist: {
    key: 'BannerPinia',
    storage: typeof window !== 'undefined' ? sessionStorage : undefined,
    paths: ['getListBanner','lastFetched'],
  }
})
