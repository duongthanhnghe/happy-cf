import { ref, computed, watch } from "vue";
import { defineStore } from "pinia";
import { usersAPI } from "@/services/users.service";
import { Loading } from '@/utils/global'
import { showWarning } from "@/utils/toast";
import type { ProductDTO } from '@/server/types/dto/product.dto'
import type { SearchKeywordDTO } from '@/server/types/dto/search-keyword.dto'
import {useProductAll} from "@/composables/product/useProductAll";

export const useSearchStore = defineStore("Search", () => {

const { getListProductAll, fetchListProductAll } = useProductAll()

//state
const txtSearch = ref('');
const isTogglePopup = ref<boolean>(false);
const pageSize = 5
const limitSearchKeyword = ref<number>(10);
const dataListSearchKeyword = ref<SearchKeywordDTO[]|null>(null);

//state product most order
const dataListProduct = ref<ProductDTO[]|null>(null);

const handleTogglePopup = (value: boolean) => {
  isTogglePopup.value = value;
  if(!dataListSearchKeyword.value) getApiListSearchKeyword()
};

const handleCancelSearch = () => {
  txtSearch.value = ''
  dataListProduct.value = null
  items.value = null
}

const items = ref<ProductDTO[]|null>(null)

function load({ done }: { done: (status: 'ok' | 'empty') => void }) {
  if(!items.value) return
  const start = items.value.length
  const nextItems = dataListProduct.value?.slice(start, start + pageSize)
  if(!nextItems) return
  setTimeout(() => {
    if (nextItems.length > 0) {
      if(!items.value) return
      items.value.push(...nextItems)
      done('ok')
    } else {
      done('empty')
    }
  }, 500)
}

const onChangeSearch = async () => {
  if(txtSearch.value === '') {
    showWarning('Vui long nhap tu khoa')
    if(items.value && items.value.length === 0 ) handleCancelSearch()
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
  Loading(true)
  if(!getListProductAll.value) await fetchListProductAll()
  try {
    const data = getListProductAll.value
    if(!data) {
      Loading(false)
      return
    }
    dataListProduct.value = data.filter((item: ProductDTO) =>
      item.productName.toLowerCase().includes(keyQuery.toLowerCase())
    )
    Loading(false)
  } catch (err) {
    console.error('Error most order', err)
    Loading(false)
  }
}

const getApiListSearchKeyword = async () => {
  try {
    const data = await usersAPI.getTopSearchKeyword(limitSearchKeyword.value)
    if(data.code === 0) dataListSearchKeyword.value = data.data
  } catch (err) {
    console.error('Error most order', err)
  }
}

watch(dataListProduct, (newVal) => {
  if(!newVal) return
  items.value = [...newVal.slice(0, pageSize)]
})

  //getters
  const getItems = computed(() => items.value)
  const getSearchKeyword = computed(() => dataListSearchKeyword.value)

  return {
    // state
    items,
    txtSearch,
    isTogglePopup,
    dataListProduct,
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
