import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { usePostAllPagination } from '@/composables/news/usePostAllPagination'
import { usePagination } from '@/utils/paginationHandle'
import type { PostNewsDTO } from '@/server/types/dto/v1/news.dto'

export const useMainStore = defineStore("NewsMainNewsStore", () => {
  const { loading, getListPostApi, fetchPostList } = usePostAllPagination()

  const listItems = ref<PostNewsDTO[]|null>(null);
  const pagination = ref(null)
  const page = ref('1')
  const limit = 10

  watch(page, async (newValue) => {
    if(newValue) {
      await fetchPostList(newValue,limit, '')
      listItems.value = getListPostApi.value?.data || []
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
    loading,
    handleChangePage
  };
});
