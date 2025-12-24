import { computed, ref, watch, type Ref } from "vue";
import type { ProductDTO } from "@/server/types/dto/v1/product.dto";
import { usePagination } from "@/utils/paginationHandle";
import type { PaginationMeta } from "@/server/types/common/pagination.dto";

export const useProductMainOperation = (
    listItems: Ref<ProductDTO[]|null>,
    page: Ref<string>,
    valueChangePage: Ref<boolean|null>,
    selectedPriceRanges: Ref<string[]>,
    selectedVariants: Ref<string[]>,
    PRICE_RANGES: any,
    pagination: Ref<PaginationMeta|null>,
    
) => {

  const getListItems = computed(() => {
    if (!listItems.value) return []

    return listItems.value
      .filter(item => {
        if (selectedPriceRanges.value.length === 0) return true

        const price = Number(item.price) || 0

        return selectedPriceRanges.value.some(key => {
          const range = PRICE_RANGES.find(r => r.key === key)
          if (!range) return false
          return price >= range.min && price <= range.max
        })
      })
      .filter(item => {
        if (selectedVariants.value.length === 0) return true

        const itemVariantIds =
          item.variantCombinations?.flatMap(g =>
            g.variants?.map(v => v.variantId)
          ) || []

        return selectedVariants.value.some(vId =>
          itemVariantIds.includes(vId)
        )
      })
  })

  watch(valueChangePage, (newVal) => {
    if(newVal !== null) handleChangePage(newVal)
    valueChangePage.value = null
  })

  const { handleChangePage, getTotalPages } = usePagination(page, computed(() => pagination.value?.totalPages ?? 0))

  const getTotalItems = computed(() => { return pagination.value?.total ?? 0 })

  return {
    getListItems,
    getTotalItems,
    getTotalPages,
    handleChangePage
  };
};