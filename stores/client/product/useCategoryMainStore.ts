import { watch, computed } from "vue";
import { defineStore } from "pinia";
import { Loading} from '@/utils/global'
import { useProductCategoryDetail } from '@/composables/product/useProductCategoryDetail'
import { useProductByCategory } from '@/composables/product/useProductByCategory'
import { useProductCategoryChildren } from '@/composables/product/useProductCategoryChildren'
import { scrollIntoView } from "@/utils/global";
import { useProductFilterState } from "@/composables/product/filter/useProductFilterState";
import { useProductFilterUtils } from "@/composables/product/filter/useProductFilterUtils";
import { useProductMainState } from "@/composables/product/category/useProductMainState";
import { useProductMainOperation } from "@/composables/product/category/useProductMainOperation";

export const useCategoryMainStore = defineStore("CategoryMainProductStore", () => {
  const { getProductCategoryDetail } = useProductCategoryDetail()
  const { loadingData, getProductByCategoryApi, fetchProductByCategory } = useProductByCategory()
  const { getListCategoryChildren } = useProductCategoryChildren()

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

  watch(getProductByCategoryApi, (newValue) => {
    if (newValue && newValue.data) {
      state.listItems.value = newValue.data
      state.pagination.value = newValue.pagination
    }
  }, { immediate: true })

  watch([state.page, stateFilter.filterType, stateFilter.filterCategory,],
    async ([newPage, newFilterType, newFilterCategory], [oldPage, oldFilterType, oldFilterCategory]) => {

      if ((newFilterType !== oldFilterType || newFilterCategory !== oldFilterCategory) && newPage !== '1') {
        state.page.value = '1'
        return
      }

      if (!getProductCategoryDetail.value?.id) return

      const categoryId = stateFilter.filterCategory.value || getProductCategoryDetail.value.id

      Loading(true)
      try {
        await fetchProductByCategory(
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

  const listBannerCategory = computed(() => {
    if (!getListCategoryChildren.value || getListCategoryChildren.value.length === 0) {
      if(!getProductCategoryDetail) return
      return getProductCategoryDetail.value?.banner ? getProductCategoryDetail.value?.banner : state.IMAGE_AUTH_LOGIN
    }

    return getListCategoryChildren.value
      .map(item => item.banner)
      .filter(Boolean)
  })

  return {
    ...state,
    ...stateFilter,
    getProductCategoryDetail,
    getListCategoryChildren,
    loadingData,
    listBannerCategory,
    ...utilsFilter,
    ...operation,
  };
});
