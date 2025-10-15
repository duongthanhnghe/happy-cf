import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { useProductSales } from '@/composables/product/useProductSales'
import type { ProductDTO } from '@/server/types/dto/v1/product.dto'

const TTL_MS = 10 * 60 * 1000

export const useProductSaleStore = defineStore("ProductSaleStore", () => {
  const { getListProductSales, fetchListProductSales } = useProductSales()

  const dataList = ref<ProductDTO[]>([])
  const lastFetched = ref<number | null>(null)
  const loading = ref(false)

  const fetchProductStore = async () => {
    const now = Date.now()
    if (dataList.value.length > 0 && lastFetched.value && now - lastFetched.value < TTL_MS) return

    loading.value = true
    try {
      await fetchListProductSales()
      dataList.value = getListProductSales.value
      lastFetched.value = now
    } finally {
      loading.value = false
    }
  }

  const getListData = computed(() => dataList.value);
  
  return {
    dataList,
    fetchProductStore,
    getListData,
    lastFetched,
    loading,
  };
}, {
  persist: {
    key: 'ProductSalePinia',
    storage: typeof window !== 'undefined' ? sessionStorage : undefined,
    paths: ['dataList','lastFetched'],
  }
})
