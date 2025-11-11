import { ref } from "vue";
import { defineStore } from "pinia";
import { useProductSales } from '@/composables/product/useProductSales'

const TTL_MS = 10 * 60 * 1000

export const useProductSaleStore = defineStore("ProductSaleStore", () => {
  const { getListProductSales, fetchListProductSales } = useProductSales()

  const lastFetched = ref<number | null>(null)
  const loading = ref(false)

  const fetchProductStore = async () => {
    const now = Date.now()
    if (getListProductSales.value.length > 0 && lastFetched.value && now - lastFetched.value < TTL_MS) return

    loading.value = true
    try {
      await fetchListProductSales()
      lastFetched.value = now
    } finally {
      loading.value = false
    }
  }

  return {
    getListProductSales,
    fetchProductStore,
    lastFetched,
    loading,
  };
}, {
  persist: {
    key: 'ProductSalePinia',
    storage: typeof window !== 'undefined' ? sessionStorage : undefined,
    paths: ['getListProductSales','lastFetched'],
  }
})
