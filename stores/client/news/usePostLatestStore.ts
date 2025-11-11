import { ref } from "vue";
import { defineStore } from "pinia";
import { useNewsLatest } from '@/composables/news/useNewsLatest'

const TTL_MS = 10 * 60 * 1000

export const usePostLatestStore = defineStore("PostLatestStore", () => {
  const { getListNewsLatest, getApiListNewsLatest } = useNewsLatest()

  const lastFetched = ref<number | null>(null)
  const loading = ref(false)
  const limit = 5

  const fetchPostStore = async () => {
    const now = Date.now()
    if (getListNewsLatest.value.length > 0 && lastFetched.value && now - lastFetched.value < TTL_MS) return

    loading.value = true
    try {
      await getApiListNewsLatest(limit)
      lastFetched.value = now
    } finally {
      loading.value = false
    }
  }

  return {
    fetchPostStore,
    lastFetched,
    loading,
    getListNewsLatest,
  };
}, {
  persist: {
    key: 'PostLatestPinia',
    storage: typeof window !== 'undefined' ? sessionStorage : undefined,
    paths: ['getListNewsLatest','lastFetched'],
  }
})
