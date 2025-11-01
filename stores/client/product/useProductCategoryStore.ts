import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { CategoryProductDTO } from '@/server/types/dto/v1/product.dto'
import { useProductCategoryTree } from '@/composables/product/useProductCategoryTree';

const TTL_MS = 10 * 60 * 1000

export const useProductCategoryStore = defineStore("ProductCategoryStore", () => {
  const { getListCategoryTree, fetchCategoryListTree } = useProductCategoryTree();

  const dataList = ref<CategoryProductDTO[]>([])
  const lastFetched = ref<number | null>(null)
  const loading = ref(false)

  const fetchCategoryStore = async () => {
    const now = Date.now()
    if (dataList.value.length > 0 && lastFetched.value && now - lastFetched.value < TTL_MS) return

    loading.value = true
    try {
      await fetchCategoryListTree()
      dataList.value = getListCategoryTree.value
      lastFetched.value = now
    } finally {
      loading.value = false
    }
  }

  const getListData = computed(() => dataList.value);
  
  return {
    dataList,
    fetchCategoryStore,
    getListData,
    lastFetched,
    loading,
  };
}, {
  persist: {
    key: 'ProductCategoryPinia',
    storage: typeof window !== 'undefined' ? sessionStorage : undefined,
    paths: ['dataList','lastFetched'],
  }
})
