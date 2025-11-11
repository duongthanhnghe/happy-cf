import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { Loading} from '@/utils/global'
import { useProductCategoryDetail } from '@/composables/product/useProductCategoryDetail'
import { useProductByCategory } from '@/composables/product/useProductByCategory'
import { usePagination } from '@/utils/paginationHandle'
import { useProductCategoryChildren } from '@/composables/product/useProductCategoryChildren'
import type { ProductDTO, ProductSortType } from '@/server/types/dto/v1/product.dto'

export const useCategoryMainStore = defineStore("CategoryMainProductStore", () => {
  const { getProductCategoryDetail } = useProductCategoryDetail()
  const { loadingData, getProductByCategoryApi, fetchProductByCategory } = useProductByCategory()
  const { getListCategoryChildren } = useProductCategoryChildren()

  const listItems = ref<ProductDTO[]|null>(null);
  const pagination = computed(() => getProductByCategoryApi.value?.pagination)
  const page = ref('1')
  const limit = 20
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
      try {
        Loading(true)
        await fetchProductByCategory(getProductCategoryDetail.value?.id,Number(newValue), limit, filterType.value)
        listItems.value = getProductByCategoryApi.value?.data || []
        Loading(false)
      } catch (error) {
        console.error('category-news error:', error)
      }
    }
  })

  watch([listItems, filterType], () => {
    if (listItems.value?.length) {
      rangePrice.value = [0, maxPrice.value]
    }
  }, { immediate: true })

  const { handleChangePage, getTotalPages } = usePagination(page, computed(() => pagination.value?.totalPages ?? 0))

  const getListItems = computed(() => {
    const [min, max] = rangePrice.value
    return listItems.value?.filter(item => {
      const price = item.price || 0
      return price >= min && price <= max
    })
  })

  return {
    filterType,
    filterArray,
    limit,
    page,
    getProductCategoryDetail,
    getListItems,
    getTotalPages,
    rangePrice,
    maxPrice,
    getListCategoryChildren,
    filterCategory,
    loadingData,
    handleChangePage,
  };
});
