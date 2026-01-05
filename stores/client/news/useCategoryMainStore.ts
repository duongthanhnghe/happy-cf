import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { Loading} from '@/utils/global'
import { useNewsCategoryDetail } from '@/composables/news/useNewsCategoryDetail'
import { usePostByCategory } from '@/composables/news/usePostByCategory'
import { usePagination } from '@/utils/paginationHandle'
import type { PostNewsDTO } from '@/server/types/dto/v1/news.dto'

export const useCategoryMainStore = defineStore("CategoryMainNewsStore", () => {
  const { getDetailNewsCategoryApi } = useNewsCategoryDetail()
  const { getPostByCategoryApi, fetchPostByCategory, loading: loadingListPost } = usePostByCategory()

  const listItems = ref<PostNewsDTO[]|null>(null);
  const pagination = computed(() => getPostByCategoryApi.value?.pagination)
  const page = ref('1')
  const limit = 10

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

  const fetchInit = async (id: string) => {
    await fetchPostByCategory(id, 1, limit)
    listItems.value = getPostByCategoryApi.value?.data || []
  }

  const { handleChangePage, getTotalPages } = usePagination(page, computed(() => pagination.value?.totalPages ?? 0))

  const getListItems = computed(() => listItems.value);

  return {
    limit,
    page,
    listItems,
    getListItems,
    getTotalPages,
    loadingListPost,
    handleChangePage,
    getDetailNewsCategoryApi,
    fetchInit,
  };
});
