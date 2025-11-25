import { ref } from "vue";
import { defineStore } from "pinia";
import { useProductMostOrder } from '@/composables/product/useProductMostOrder'

const TTL_MS = 10 * 60 * 1000

export const useProductMostOrderStore = defineStore("ProductMostOrderStore", () => {
  const { fetchListProductMostOrder, getListProductMostOrder, loading } = useProductMostOrder()

  const lastFetched = ref<number | null>(null)

  const fetchProductStore = async () => {
    const now = Date.now()
    if (getListProductMostOrder.value.length > 0 && lastFetched.value && now - lastFetched.value < TTL_MS) return

    await fetchListProductMostOrder()
    lastFetched.value = now
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
