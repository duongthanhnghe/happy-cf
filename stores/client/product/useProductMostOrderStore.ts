import { defineStore } from "pinia";
import { useProductFilterState } from "@/composables/product/filter/useProductFilterState";
import { useProductFilterUtils } from "@/composables/product/filter/useProductFilterUtils";
import { useProductMainState } from "@/composables/product/category/useProductMainState";
import { useProductMainOperation } from "@/composables/product/category/useProductMainOperation";
import { watch } from 'vue';
import { Loading, scrollIntoView } from '@/utils/global';
import { useProductMostOrder } from '@/composables/product/useProductMostOrder'

export const useProductMostOrderStore = defineStore("ProductMostOrderStore", () => {
  const { fetchListProductMostOrder, getListProductMostOrder, loadingData } = useProductMostOrder()

  const stateFilter = useProductFilterState()
  const state = useProductMainState()

  const utilsFilter = useProductFilterUtils (
    stateFilter.isTogglePopupFilter,
    stateFilter.filterType,
    stateFilter.selectedPriceRanges,
    stateFilter.selectedVariants,
    stateFilter.filterCategory,
    state.page,
  )

  const operation = useProductMainOperation(
    state.listItems,
    state.page,
    state.valueChangePage,
    stateFilter.selectedPriceRanges,
    stateFilter.selectedVariants,
    stateFilter.PRICE_RANGES,
    state.pagination,
  )

  watch([state.page, stateFilter.filterType, stateFilter.filterCategory,],
    async ([newPage, newFilterType, newFilterCategory], [oldPage, oldFilterType, oldFilterCategory]) => {

      if ((newFilterType !== oldFilterType || newFilterCategory !== oldFilterCategory) && newPage !== '1') {
        state.page.value = '1'
        return
      }

      const categoryId = stateFilter.filterCategory.value || ''

      Loading(true)
      try {
        await fetchListProductMostOrder(
          categoryId,
          Number(state.page.value),
          state.limit,
          stateFilter.filterType.value
        )
      } catch (err) {
        console.error('fetch category product error:', err)
      } finally {
        Loading(false)
        if (window.innerWidth > 1024) {
          scrollIntoView(stateFilter.elFilterProduct)
        }
      }
    },
  )

  const fetchInit = async () => {
    await fetchListProductMostOrder('', Number(state.page.value), state.limit, stateFilter.filterType.value)
    if(!getListProductMostOrder.value) return
    state.listItems.value = getListProductMostOrder.value?.data
    state.pagination.value = getListProductMostOrder.value?.pagination
  }

  return {
    ...state,
    ...stateFilter,
    loadingData,
    getListProductMostOrder,
    fetchListProductMostOrder,
    ...utilsFilter,
    ...operation,
    fetchInit,
  };
})
