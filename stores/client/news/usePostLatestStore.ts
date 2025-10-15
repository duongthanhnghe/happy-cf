import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useNewsLatest } from '@/composables/news/useNewsLatest'
import type { PostNewsDTO } from '@/server/types/dto/v1/news.dto'

const TTL_MS = 10 * 60 * 1000

export const usePostLatestStore = defineStore("PostLatestStore", () => {
  const { getListNewsLatest, getApiListNewsLatest } = useNewsLatest()

  const dataList = ref<PostNewsDTO[]>([])
  const lastFetched = ref<number | null>(null)
  const loading = ref(false)
  const limit = 5

  const fetchPostStore = async () => {
    const now = Date.now()
    if (dataList.value.length > 0 && lastFetched.value && now - lastFetched.value < TTL_MS) return

    loading.value = true
    try {
      await getApiListNewsLatest(limit)
      dataList.value = getListNewsLatest.value
      lastFetched.value = now
    } finally {
      loading.value = false
    }
  }

  const getListData = computed(() => dataList.value);
  
  return {
    dataList,
    fetchPostStore,
    getListData,
    lastFetched,
    loading,
  };
}, {
  persist: {
    key: 'PostLatestPinia',
    storage: typeof window !== 'undefined' ? sessionStorage : undefined,
    paths: ['dataList','lastFetched'],
  }
})
