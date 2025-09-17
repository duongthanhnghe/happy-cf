import { ref, computed } from "vue";
import { defineStore } from "pinia";
import { usersAPI } from "@/services/users.service";
import { showWarning } from "@/utils/toast";
import type { ProductPaginationDTO } from '@/server/types/dto/product.dto'
import type { SearchKeywordDTO } from '@/server/types/dto/search-keyword.dto'
import { useProductSearch } from "@/composables/product/useProductSearch";
import { useProductMostOrderStore } from '@/stores/client/product/useProductMostOrderStore';

export const useSearchStore = defineStore("Search", () => {

const storeProductMostOrder = useProductMostOrderStore()
const { getListProductSearch, fetchListProductSearch } = useProductSearch()

//state
const txtSearch = ref('');
const isTogglePopup = ref<boolean>(false);
const limit = 10
const limitSearchKeyword = ref<number>(10);
const dataListSearchKeyword = ref<SearchKeywordDTO[]|null>(null);
const items = ref<ProductPaginationDTO|null>(null)

const handleTogglePopup = (value: boolean) => {
  isTogglePopup.value = value;
  if(!dataListSearchKeyword.value) getApiListSearchKeyword()
  if(storeProductMostOrder.getListData.length === 0) storeProductMostOrder.fetchProductStore()
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
  try {
    await usersAPI.logSearchKeyword(keyQuery)
  } catch (err) {
    console.warn('Không log được từ khóa:', keyQuery)
  }
};

const handleLabelSearchItem = (keyword:string) => {
  txtSearch.value = keyword
  getApiListProduct(keyword)
}

const getApiListProduct = async (keyQuery: string) => {
  await fetchListProductSearch(keyQuery, 1, limit)
  if(getListProductSearch.value) items.value = getListProductSearch.value
}

const getApiListSearchKeyword = async () => {
  try {
    const data = await usersAPI.getTopSearchKeyword(limitSearchKeyword.value)
    if(data.code === 0) dataListSearchKeyword.value = data.data
  } catch (err) {
    console.error('Error most order', err)
  }
}

  //getters
  const getItems = computed(() => items.value?.data)
  const getSearchKeyword = computed(() => dataListSearchKeyword.value)

  return {
    // state
    items,
    txtSearch,
    isTogglePopup,
    dataListSearchKeyword,
    limitSearchKeyword,
    // actions
    handleTogglePopup,
    handleCancelSearch,
    getApiListProduct,
    load,
    onChangeSearch,
    getApiListSearchKeyword,
    handleLabelSearchItem,
    //getters
    getItems,
    getSearchKeyword,
  };
});
