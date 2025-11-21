import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { Loading} from '@/utils/global'
import { useProductCategoryDetail } from '@/composables/product/useProductCategoryDetail'
import { useProductByCategory } from '@/composables/product/useProductByCategory'
import { usePagination } from '@/utils/paginationHandle'
import { useProductCategoryChildren } from '@/composables/product/useProductCategoryChildren'
import type { ProductDTO, ProductSortType } from '@/server/types/dto/v1/product.dto'
import { scrollIntoView } from "@/utils/global";

export const useCategoryMainStore = defineStore("CategoryMainProductStore", () => {
  const { getProductCategoryDetail } = useProductCategoryDetail()
  const { loadingData, getProductByCategoryApi, fetchProductByCategory } = useProductByCategory()
  const { getListCategoryChildren } = useProductCategoryChildren()

  const listItems = ref<ProductDTO[]|null>(null);
  const pagination = computed(() => getProductByCategoryApi.value?.pagination)
  const page = ref('1')
  const limit = 24
  const filterCategory = ref<string>('')
  const filterType = ref<ProductSortType>('discount')
  const filterArray = ref([
    {
      title: 'Khuyên mãi',
      value: 'discount',
    },
    {
      title: 'Mua nhieu',
      value: 'popular',
    },
    {
      title: 'Cao den thap',
      value: 'price_desc',
    },
    {
      title: 'Thap den cao',
      value: 'price_asc',
    },
  ])
  const maxPrice = ref(0)
  const rangePrice = ref([0, maxPrice.value])
  const isTogglePopupFilter = ref(false)
  const valueChangePage = ref<boolean|null>(null)

  watch(getProductByCategoryApi, (newValue) => {
    if (newValue && newValue.data) {
      listItems.value = newValue.data
      if(listItems.value && listItems.value.length > 0) {
        maxPrice.value = Math.max(...listItems.value.map(item => item.price || 0))
      }
    }
  }, { immediate: true })

  watch([filterType, filterCategory], ([newFilterType, newFilterCategory]) => {
    if (page.value !== '1') {
      page.value = '1'
    } else {
      if (getProductCategoryDetail.value?.id) {
        const categoryId = newFilterCategory || getProductCategoryDetail.value.id
        fetchProductByCategory(categoryId, Number(page.value), limit, newFilterType)
      }
    }
  })

  watch(page, async (newValue) => {
    if(newValue && getProductCategoryDetail.value) {
      Loading(true)
      try {
        await fetchProductByCategory(getProductCategoryDetail.value?.id,Number(newValue), limit, filterType.value)
        listItems.value = getProductByCategoryApi.value?.data || []
      } catch (error) {
        console.error('category-product error:', error)
      } finally {
        Loading(false)
        if(window.innerWidth > 1024) scrollIntoView('filter-product')
      }
    }
  })

  watch([listItems, filterType], () => {
    if (!getProductCategoryDetail.value?.id) return
    if (listItems.value?.length) {
      rangePrice.value = [0, maxPrice.value]
    }
  }, { immediate: true })

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
    filterType.value = 'discount'
    maxPrice.value = listItems.value ? Math.max(...listItems.value.map(item => item.price)) : 0
    rangePrice.value = [0, maxPrice.value]
    filterCategory.value = ''
  }

  const hasFilter = computed(() => {
    return (
      page.value !== '1' ||
      filterType.value !== 'discount' ||
      filterCategory.value !== '' ||
      rangePrice.value[0] !== 0 || 
      rangePrice.value[1] !== maxPrice.value 
    )
  })

  const getListItems = computed(() => {
    const [min, max] = rangePrice.value
    if (maxPrice.value === 0) return listItems.value

    return listItems.value?.filter(item => {
      const price = item.price || 0
      return price >= min && price <= max
    })
  })

  const getTotalItems = computed(() => { return pagination.value?.total })

  return {
    filterType,
    filterArray,
    limit,
    page,
    getProductCategoryDetail,
    getListItems,
    getTotalPages,
    getTotalItems,
    rangePrice,
    maxPrice,
    getListCategoryChildren,
    filterCategory,
    loadingData,
    isTogglePopupFilter,
    hasFilter,
    valueChangePage,
    handleChangePage,
    handleTogglePopupFilter,
    resetFilter,
  };
});
