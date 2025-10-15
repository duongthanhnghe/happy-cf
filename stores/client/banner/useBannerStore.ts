import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useBanner } from '@/composables/banner/useBanner';
import type { BannerDTO } from '@/server/types/dto/v1/banner.dto'

const TTL_MS = 10 * 60 * 1000

export const useBannerStore = defineStore("BannerStore", () => {
  const { fetchBanner, getListBanner } = useBanner();
  const dataList = ref<BannerDTO[]>([])
  const lastFetched = ref<number | null>(null)
  const loading = ref(false)

  const fetchBannerStore = async () => {
    const now = Date.now()
    if (dataList.value.length > 0 && lastFetched.value && now - lastFetched.value < TTL_MS) return

    loading.value = true
    try {
      await fetchBanner()
      dataList.value = getListBanner.value
      lastFetched.value = now
    } finally {
      loading.value = false
    }
  }

  const getListData = computed(() => dataList.value);
  
  return {
    dataList,
    fetchBannerStore,
    getListData,
    lastFetched,
    loading,
  };
}, {
  persist: {
    key: 'BannerPinia',
    storage: typeof window !== 'undefined' ? sessionStorage : undefined,
    paths: ['dataList','lastFetched'],
  }
})
