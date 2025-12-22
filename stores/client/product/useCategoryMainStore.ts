import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { Loading} from '@/utils/global'
import { useProductCategoryDetail } from '@/composables/product/useProductCategoryDetail'
import { useProductByCategory } from '@/composables/product/useProductByCategory'
import { usePagination } from '@/utils/paginationHandle'
import { useProductCategoryChildren } from '@/composables/product/useProductCategoryChildren'
import type { ProductDTO, ProductSortType, ProductFilterOption } from '@/server/types/dto/v1/product.dto'
import { scrollIntoView } from "@/utils/global";
import { IMAGE_AUTH_LOGIN } from "@/const/image";

export const useCategoryMainStore = defineStore("CategoryMainProductStore", () => {
  const { getProductCategoryDetail } = useProductCategoryDetail()
  const { loadingData, getProductByCategoryApi, fetchProductByCategory } = useProductByCategory()
  const { getListCategoryChildren } = useProductCategoryChildren()

  const listItems = ref<ProductDTO[]|null>(null);
  const pagination = computed(() => getProductByCategoryApi.value?.pagination)
  const page = ref('1')
  const limit = 24
  const filterCategory = ref<string>('')
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
  const isTogglePopupFilter = ref(false)
  const valueChangePage = ref<boolean|null>(null)
  const elFilterProduct = 'filter-product'

  watch(getProductByCategoryApi, (newValue) => {
    if (newValue && newValue.data) {
      listItems.value = newValue.data
    }
  }, { immediate: true })

  watch([page, filterType, filterCategory,],
    async ([newPage, newFilterType, newFilterCategory], [oldPage, oldFilterType, oldFilterCategory]) => {

      if ((newFilterType !== oldFilterType || newFilterCategory !== oldFilterCategory) && newPage !== '1') {
        page.value = '1'
        return
      }

      if (!getProductCategoryDetail.value?.id) return

      const categoryId = filterCategory.value || getProductCategoryDetail.value.id

      Loading(true)
      try {
        await fetchProductByCategory(
          categoryId,
          Number(page.value),
          limit,
          filterType.value
        )
        listItems.value = getProductByCategoryApi.value?.data || []
      } catch (err) {
        console.error('fetch category product error:', err)
      } finally {
        Loading(false)
        if (window.innerWidth > 1024) {
          scrollIntoView(elFilterProduct)
        }
      }
    },
    { immediate: true }
  )

  watch(valueChangePage, (newVal) => {
    if(newVal !== null) handleChangePage(newVal)
    valueChangePage.value = null
  })

  const { handleChangePage, getTotalPages } = usePagination(page, computed(() => pagination.value?.totalPages ?? 0))

  const handleTogglePopupFilter = (value: boolean) => {
    isTogglePopupFilter.value = value;
  };

  const resetFilter = () => {
    isTogglePopupFilter.value = false
    page.value = '1'
    filterType.value = ''
    selectedPriceRanges.value = []
    filterCategory.value = ''
    selectedVariants.value = []
  }

  const hasFilter = computed(() => {
    return (
      page.value !== '1' ||
      filterType.value !== '' ||
      filterCategory.value !== '' ||
      selectedPriceRanges.value.length > 0 ||
      selectedVariants.value.length > 0
    )
  })

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

  const getTotalItems = computed(() => { return pagination.value?.total })

  const listBannerCategory = computed(() => {
    if (!getListCategoryChildren.value || getListCategoryChildren.value.length === 0) {
      if(!getProductCategoryDetail) return
      return getProductCategoryDetail.value?.banner ? getProductCategoryDetail.value?.banner : IMAGE_AUTH_LOGIN
    }

    return getListCategoryChildren.value
      .map(item => item.banner)
      .filter(Boolean)
  })

  return {
    listItems,
    filterType,
    filterArray,
    limit,
    page,
    getProductCategoryDetail,
    getListItems,
    getTotalPages,
    getTotalItems,
    selectedVariants,
    selectedPriceRanges,
    getListCategoryChildren,
    filterCategory,
    loadingData,
    isTogglePopupFilter,
    hasFilter,
    valueChangePage,
    listBannerCategory,
    IMAGE_AUTH_LOGIN,
    elFilterProduct,
    PRICE_RANGES,
    handleChangePage,
    handleTogglePopupFilter,
    resetFilter,
  };
});
