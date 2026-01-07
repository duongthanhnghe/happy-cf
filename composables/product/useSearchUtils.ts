import { type Ref } from 'vue';
import type { ProductPaginationDTO } from '@/server/types/dto/v1/product.dto';
import type { SearchKeywordDTO } from '@/server/types/dto/v1/search-keyword.dto';
import { ROUTES } from '@/shared/constants/routes';
import { useRouter } from 'vue-router';

export const useSearchUtils = (
  txtSearch: Ref<string>,
  isTogglePopup: Ref<boolean>,
  limit: number,
  limitSearchKeyword: number,
  items: Ref<ProductPaginationDTO|null>,
  storeProductMostOrder: any,
  getListProductSearch: Ref<ProductPaginationDTO|null>,
  getListSearchKeyword: Ref<SearchKeywordDTO[]>,
  fetchListProductSearch: (keyword: string, page: number, limit: number) => Promise<void>,
  fetchLogSearchKeyword: (keyQuery: string) => Promise<void>,
  fetchSearchKeyword: (limit: number) => Promise<void>,
  ) => {

  const router = useRouter()

  const handleTogglePopup = (value: boolean) => {
    isTogglePopup.value = value;
    if(getListSearchKeyword.value.length === 0) fetchSearchKeyword(limitSearchKeyword)
    if(!storeProductMostOrder.getListProductMostOrder) storeProductMostOrder.fetchListProductMostOrder('',storeProductMostOrder.page,storeProductMostOrder.limit,'')
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

  const handleViewAll = async () => {
    router.push({
      path: ROUTES.PUBLIC.PRODUCT.children?.SEARCH.path,
      query: {
        search: txtSearch.value,
      },
    })
    isTogglePopup.value = false
  }

  return {
   handleTogglePopup,
   handleCancelSearch,
   load,
   onChangeSearch,
   handleLabelSearchItem,
   getApiListProduct,
   handleViewAll,
  };
};