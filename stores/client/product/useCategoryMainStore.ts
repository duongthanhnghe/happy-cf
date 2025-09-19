import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { Loading} from '@/utils/global'
import { ROUTES } from '@/shared/constants/routes'
import { useProductCategoryDetail } from '@/composables/product/useProductCategoryDetail'
import { useProductByCategory } from '@/composables/product/useProductByCategory'
import { useCategoryProductSEO } from '@/composables/seo/useCategoryProductSEO'
import { usePagination } from '@/utils/paginationHandle'
import type { ProductDTO, ProductSortType } from '@/server/types/dto/product.dto'

export const useCategoryMainStore = defineStore("CategoryMainProductStore", () => {
  const { setCategoryProductSEO } = useCategoryProductSEO()
  const { getProductCategoryDetail } = useProductCategoryDetail()
  const { getProductByCategoryApi, fetchProductByCategory } = useProductByCategory()

  const listItems = ref<ProductDTO[]|null>(null);
  const pagination = computed(() => getProductByCategoryApi.value?.pagination)
  const page = ref('1')
  const limit = 20
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

  watch(getProductCategoryDetail, (newValue) => {
    if(newValue) {
      setCategoryProductSEO(newValue, ROUTES.PUBLIC.NEWS.children?.MAIN.path || '')
    }
  }, { immediate: true })

  watch(getProductByCategoryApi, (newValue) => {
    if (newValue && newValue.data) {
      listItems.value = newValue.data
    }
  }, { immediate: true })

  watch(filterType, (newValue) => {
    filterType.value = newValue
    if(page.value !== '1') {
      page.value = '1'
    } else {
      if(getProductCategoryDetail.value?.id) {
        fetchProductByCategory(getProductCategoryDetail.value?.id,Number(page.value), limit, newValue)
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

  const getDetail = computed(() => getProductCategoryDetail.value);

  const getListItems = computed(() => listItems.value);

  return {
    filterType,
    filterArray,
    limit,
    page,
    getDetail,
    getListItems,
    getTotalPages,
    handleChangePage
  };
});
