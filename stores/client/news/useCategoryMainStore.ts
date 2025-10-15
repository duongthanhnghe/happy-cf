import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { Loading} from '@/utils/global'
import { ROUTES } from '@/shared/constants/routes'
import { useNewsCategoryDetail } from '@/composables/news/useNewsCategoryDetail'
import { usePostByCategory } from '@/composables/news/usePostByCategory'
import { useCategoryNewsSEO } from '@/composables/seo/useCategoryNewsSEO'
import { usePagination } from '@/utils/paginationHandle'
import type { PostNewsDTO } from '@/server/types/dto/v1/news.dto'

export const useCategoryMainStore = defineStore("CategoryMainNewsStore", () => {
  const { setCategoryNewsSEO } = useCategoryNewsSEO()
  const { getDetailNewsCategoryApi } = useNewsCategoryDetail()
  const { getPostByCategoryApi, fetchPostByCategory } = usePostByCategory()

  const listItems = ref<PostNewsDTO[]|null>(null);
  const pagination = computed(() => getPostByCategoryApi.value?.pagination)
  const page = ref('1')
  const limit = 10

  watch(getDetailNewsCategoryApi, (newValue) => {
    if(newValue) {
      setCategoryNewsSEO(newValue, ROUTES.PUBLIC.NEWS.children?.MAIN.path || '')
    }
  }, { immediate: true })

  watch(getPostByCategoryApi, (newValue) => {
    if (newValue && newValue.data) {
      listItems.value = newValue.data
    }
  })

  watch(page, async (newValue) => {
    if(newValue && getDetailNewsCategoryApi.value) {
      Loading(true)
      try {
        await fetchPostByCategory(getDetailNewsCategoryApi.value?.id,Number(newValue), limit)
        listItems.value = getPostByCategoryApi.value?.data || []
      } catch (error) {
        console.error('category-news error:', error)
      }
      Loading(false)
    }
  })

  const { handleChangePage, getTotalPages } = usePagination(page, computed(() => pagination.value?.totalPages ?? 0))

  const getDetail = computed(() => getDetailNewsCategoryApi.value);

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
