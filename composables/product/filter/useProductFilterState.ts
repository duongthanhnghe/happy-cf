import { ref } from "vue";
import type { ProductFilterOption, ProductSortType } from "@/server/types/dto/v1/product.dto";

export const useProductFilterState = () => {

  const filterArray = ref<ProductFilterOption[]>([
    {
      title: 'Mới nhất',
      value: '',
    },
    {
      title: 'Khuyến mãi',
      value: 'discount',
    },
    {
      title: 'Bán chạy',
      value: 'popular',
    },
    {
      title: 'Giá cao đến thấp',
      value: 'price_desc',
    },
    {
      title: 'Giá thấp đến cao',
      value: 'price_asc',
    },
  ])

  const PRICE_RANGES = [
    {
      key: '0-200',
      label: '0 - 200.000đ',
      min: 0,
      max: 200_000,
    },
    {
      key: '200-300',
      label: '200.000đ - 300.000đ',
      min: 200_000,
      max: 300_000,
    },
    {
      key: '300-500',
      label: '300.000đ - 500.000đ',
      min: 300_000,
      max: 500_000,
    },
    {
      key: '500+',
      label: '> 500.000đ',
      min: 500_000,
      max: Infinity,
    },
  ]

  const filterType = ref<ProductSortType>(filterArray.value[0].value)
  const selectedPriceRanges = ref<string[]>([])
  const selectedVariants = ref<string[]>([])
  const filterCategory = ref<string>('')
  const isTogglePopupFilter = ref(false)
  const elFilterProduct = 'filter-product'

  return {
    filterType,
    filterArray,
    selectedVariants,
    selectedPriceRanges,
    isTogglePopupFilter,
    elFilterProduct,
    PRICE_RANGES,
    filterCategory,
  };
};