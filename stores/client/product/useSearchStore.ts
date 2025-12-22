import { ref, computed } from "vue";
import { defineStore } from "pinia";
import type { ProductPaginationDTO } from '@/server/types/dto/v1/product.dto'
import { useProductSearch } from "@/composables/product/useProductSearch";
import { useProductMostOrderStore } from '@/stores/client/product/useProductMostOrderStore';
import { useSearchKeyword } from "@/composables/product/useSearchKeyword";
import { useSearchUtils } from "@/composables/product/useSearchUtils";

export const useSearchStore = defineStore("SearchStore", () => {

  const storeProductMostOrder = useProductMostOrderStore()
  const { getListProductSearch, fetchListProductSearch, loading: loadingProduct } = useProductSearch()
  const { getListSearchKeyword, fetchLogSearchKeyword, fetchSearchKeyword } = useSearchKeyword()

  const txtSearch = ref('');
  const isTogglePopup = ref<boolean>(false);
  const limit = 12
  const limitSearchKeyword = (10);
  const items = ref<ProductPaginationDTO|null>(null)

  const utils = useSearchUtils(
    txtSearch,
    isTogglePopup,
    limit,
    limitSearchKeyword,
    items,
    storeProductMostOrder,
    getListProductSearch,
    getListSearchKeyword,
    fetchListProductSearch,
    fetchLogSearchKeyword,
    fetchSearchKeyword,
  );

  const getListProductResult = computed(() => items.value)

  return {
    txtSearch,
    isTogglePopup,
    limit,
    items,
    ...utils,
    getListProductResult,
    getListSearchKeyword,
    loadingProduct,
    getListProductSearch,
    fetchListProductSearch,
  };
});
