import { ref } from "vue";
import { defineStore } from "pinia";
import { useProductMostOrder } from '@/composables/product/useProductMostOrder'

const TTL_MS = 10 * 60 * 1000

export const useProductMostOrderStore = defineStore("ProductMostOrderStore", () => {
  const { fetchListProductMostOrder, getListProductMostOrder } = useProductMostOrder()

  const lastFetched = ref<number | null>(null)
  const loading = ref(false)

  const fetchProductStore = async () => {
    const now = Date.now()
    if (getListProductMostOrder.value.length > 0 && lastFetched.value && now - lastFetched.value < TTL_MS) return

    loading.value = true
    try {
      await fetchListProductMostOrder()
      lastFetched.value = now
    } finally {
      loading.value = false
    }
  }

  return {
    fetchProductStore,
    lastFetched,
    loading,
    getListProductMostOrder,
  };
}, {
  persist: {
    key: 'ProductMostOrderPinia',
    storage: typeof window !== 'undefined' ? sessionStorage : undefined,
    paths: ['getListProductMostOrder','lastFetched'],
  }
})
