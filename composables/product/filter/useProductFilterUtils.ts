import { computed, type Ref } from "vue";
import type { ProductSortType } from "@/server/types/dto/v1/product.dto";

export const useProductFilterUtils = (
  isTogglePopupFilter: Ref<boolean>,
  filterType: Ref<ProductSortType>,
  selectedPriceRanges: Ref<string[]>,
  selectedVariants: Ref<string[]>,
  filterCategory: Ref<string>,
  page: Ref<string>,
) => {

  const handleTogglePopupFilter = (value: boolean) => {
    isTogglePopupFilter.value = value;
  };

  const togglePriceRange = (key: string) => {
    const list = selectedPriceRanges.value
    selectedPriceRanges.value = list.includes(key)
      ? list.filter(k => k !== key)
      : [...list, key]

    page.value = '1'
  }

  const toggleVariant = (variantId: string) => {
    const list = selectedVariants.value
    selectedVariants.value = list.includes(variantId)
      ? list.filter(v => v !== variantId)
      : [...list, variantId]

    page.value = '1'
  }

  const resetFilter = () => {
    page.value = '1'
    isTogglePopupFilter.value = false
    filterType.value = ''
    selectedPriceRanges.value = []
    selectedVariants.value = []
    filterCategory.value = ''
  }

  const hasFilter = computed(() => {
    return (
      filterType.value !== '' ||
      selectedPriceRanges.value.length > 0 ||
      selectedVariants.value.length > 0 ||
      filterCategory.value !== '' ||
      page.value !== '1' 
    )
  })

  return {
   handleTogglePopupFilter,
   resetFilter,
   togglePriceRange,
    toggleVariant,  
   hasFilter,
  };
};