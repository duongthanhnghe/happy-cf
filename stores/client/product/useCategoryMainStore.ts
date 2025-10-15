import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { Loading} from '@/utils/global'
import { ROUTES } from '@/shared/constants/routes'
import { useProductCategoryDetail } from '@/composables/product/useProductCategoryDetail'
import { useProductByCategory } from '@/composables/product/useProductByCategory'
import { useCategoryProductSEO } from '@/composables/seo/useCategoryProductSEO'
import { usePagination } from '@/utils/paginationHandle'
import { useProductCategoryChildren } from '@/composables/product/useProductCategoryChildren'
import type { ProductDTO, ProductSortType } from '@/server/types/dto/v1/product.dto'

export const useCategoryMainStore = defineStore("CategoryMainProductStore", () => {
  const { setCategoryProductSEO } = useCategoryProductSEO()
  const { getProductCategoryDetail } = useProductCategoryDetail()
  const { getProductByCategoryApi, fetchProductByCategory } = useProductByCategory()
  const { getListCategoryChildren, fetchCategoryChildrenList } = useProductCategoryChildren()

  const listItems = ref<ProductDTO[]|null>(null);
  const pagination = computed(() => getProductByCategoryApi.value?.pagination)
  const page = ref('1')
  const limit = 2
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

  watch(getProductCategoryDetail, (newValue) => {
    if(newValue) {
      setCategoryProductSEO(newValue, ROUTES.PUBLIC.NEWS.children?.MAIN.path || '')
      fetchCategoryChildrenList(newValue.id, false)
    }
  }, { immediate: true })

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
        console.error('category-news error:', error)
      }
      Loading(false)
    }
  })

  const { handleChangePage, getTotalPages } = usePagination(page, computed(() => pagination.value?.totalPages ?? 0))

  watch([listItems, filterType], () => {
    if (listItems.value?.length) {
      rangePrice.value = [0, maxPrice.value]
    }
  }, { immediate: true })

  const getListItems = computed(() => {
    const [min, max] = rangePrice.value
    return listItems.value?.filter(item => {
      const price = item.price || 0
      return price >= min && price <= max
    })
  })

  const getDetail = computed(() => getProductCategoryDetail.value);

  return {
    filterType,
    filterArray,
    limit,
    page,
    getDetail,
    getListItems,
    getTotalPages,
    rangePrice,
    maxPrice,
    getListCategoryChildren,
    filterCategory,
    handleChangePage,
  };
});
