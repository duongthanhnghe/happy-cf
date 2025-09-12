import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { Loading} from '@/utils/global'
import { ROUTES } from '@/shared/constants/routes'
import { useProductCategoryDetail } from '@/composables/product/useProductCategoryDetail'
import { useProductByCategory } from '@/composables/product/useProductByCategory'
import { useCategoryProductSEO } from '@/composables/seo/useCategoryProductSEO'
import { usePagination } from '@/utils/paginationHandle'
import type { ProductDTO } from '@/server/types/dto/product.dto'

export const useCategoryMainStore = defineStore("CategoryMainProductStore", () => {
  const { setCategoryProductSEO } = useCategoryProductSEO()
  const { getProductCategoryDetail } = useProductCategoryDetail()
  const { getProductByCategoryApi, fetchProductByCategory } = useProductByCategory()

  const listItems = ref<ProductDTO[]|null>(null);
  const pagination = computed(() => getProductByCategoryApi.value?.pagination)
  const page = ref('1')
  const limit = 2

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

  watch(page, async (newValue) => {
    if(newValue && getProductCategoryDetail.value) {
      Loading(true)
      try {
        await fetchProductByCategory(getProductCategoryDetail.value?.id,Number(newValue), limit)
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
    limit,
    page,
    getDetail,
    getListItems,
    getTotalPages,
    handleChangePage
  };
});
