import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { ROUTES } from '@/shared/constants/routes'
import { usePostAllPagination } from '@/composables/news/usePostAllPagination'
import { usePagination } from '@/utils/paginationHandle'
import type { PostNewsDTO } from '@/server/types/dto/v1/news.dto'
import { Loading} from '@/utils/global'

export const useMainStore = defineStore("NewsMainNewsStore", () => {
  const { getListPostApi, fetchPostList } = usePostAllPagination()

  const listItems = ref<PostNewsDTO[]|null>(null);
  const pagination = ref(null)
  const page = ref('1')
  const limit = 1

  watch(page, async (newValue) => {
    if(newValue) {
      Loading(true)
      try {
        await fetchPostList(newValue,limit, '')
        listItems.value = getListPostApi.value?.data || []
      } catch (error) {
        console.error('news main error:', error)
      }
      Loading(false)
    }
  })

  const { handleChangePage, getTotalPages } = usePagination(page, computed(() => pagination.value?.totalPages ?? 0))

  const getListItems = computed(() => listItems.value);

  return {
    limit,
    page,
    pagination,
    listItems,
    getListItems,
    getTotalPages,
    handleChangePage
  };
});
