import { ref } from "vue";
import { defineStore } from "pinia";
import { useVariantGroupAll } from '@/composables/product/useVariantGroupAll';

const TTL_MS = 60 * 60 * 1000; // 1 hour

export const useVariantGroupStore = defineStore("VariantGroupStore", () => {

  const { loading, listVariantGroup, getListVariantGroup, fetchListVariantGroup } = useVariantGroupAll();

  const lastFetched = ref<number | null>(null)

  const fetchVariantGroupStore = async () => {
    const now = Date.now()
    if (listVariantGroup.value.length > 0 && lastFetched.value && now - lastFetched.value < TTL_MS) return

    await fetchListVariantGroup()
    if(listVariantGroup.value.length > 0) {
      lastFetched.value = now
    }
  }

  return {
    fetchVariantGroupStore,
    listVariantGroup,
    getListVariantGroup,
    lastFetched,
    loading,
  };
}, {
  persist: {
    key: 'VariantGroupPinia',
    storage: typeof window !== 'undefined' ? sessionStorage : undefined,
    paths: ['listVariantGroup','lastFetched'],
  }
})
