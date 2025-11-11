import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { showWarning } from "@/utils/toast";
import type { ProductPaginationDTO } from '@/server/types/dto/v1/product.dto'
import { useProductSearch } from "@/composables/product/useProductSearch";
import { useProductMostOrderStore } from '@/stores/client/product/useProductMostOrderStore';
import { useSearchKeyword } from "@/composables/product/useSearchKeyword";

export const useSearchStore = defineStore("SearchStore", () => {

  const storeProductMostOrder = useProductMostOrderStore()
  const { getListProductSearch, fetchListProductSearch, loading: loadingProduct } = useProductSearch()
  const { getListSearchKeyword, fetchLogSearchKeyword, fetchSearchKeyword } = useSearchKeyword()

  const txtSearch = ref('');
  const isTogglePopup = ref<boolean>(false);
  const limit = 10
  const limitSearchKeyword = (10);
  const items = ref<ProductPaginationDTO|null>(null)

  const handleTogglePopup = (value: boolean) => {
    isTogglePopup.value = value;
    if(getListSearchKeyword.value.length === 0) fetchSearchKeyword(limitSearchKeyword)
    if(storeProductMostOrder.getListProductMostOrder.length === 0) storeProductMostOrder.fetchProductStore()
  };

  const handleCancelSearch = () => {
    txtSearch.value = ''
    items.value = null
  }

  async function load({ done }: { done: (status: 'ok' | 'empty') => void }) {
    if(!items.value) return
    try {
      const currentPage = items.value.pagination.page
      const totalPages = items.value.pagination.totalPages

      if (currentPage >= totalPages) {
        done('empty')
        return
      }

      const nextPage = currentPage + 1
      await fetchListProductSearch(txtSearch.value, nextPage, limit)

      if (getListProductSearch.value && getListProductSearch.value.data && getListProductSearch.value.data.length > 0) {
        items.value.data.push(...getListProductSearch.value.data)
        items.value.pagination = getListProductSearch.value.pagination
        done('ok')
      } else {
        done('empty')
      }
    } catch (err) {
      console.error('Error loading more products:', err)
      done('empty')
    }
  }

  const onChangeSearch = async () => {
    if(txtSearch.value === '') {
      showWarning('Vui long nhap tu khoa')
      if(items.value) handleCancelSearch()
      return;
    }
    const keyQuery:string = txtSearch.value
    getApiListProduct(keyQuery)
    fetchLogSearchKeyword(keyQuery)
  };

  const handleLabelSearchItem = (keyQuery:string) => {
    txtSearch.value = keyQuery
    onChangeSearch()
  }

  const getApiListProduct = async (keyQuery: string) => {
    await fetchListProductSearch(keyQuery, 1, limit)
    if(getListProductSearch.value) items.value = getListProductSearch.value
  }

  const getListProductResult = computed(() => items.value?.data)

  return {
    txtSearch,
    isTogglePopup,
    handleTogglePopup,
    handleCancelSearch,
    getApiListProduct,
    load,
    onChangeSearch,
    handleLabelSearchItem,
    getListProductResult,
    getListSearchKeyword,
    loadingProduct,
  };
});
