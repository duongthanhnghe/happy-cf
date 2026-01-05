import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { usePostAllPagination } from '@/composables/news/usePostAllPagination'
import { usePagination } from '@/utils/paginationHandle'
import type { PostNewsDTO } from '@/server/types/dto/v1/news.dto'
import type { PaginationMeta } from "@/server/types/common/pagination.dto";

export const useMainStore = defineStore("NewsMainNewsStore", () => {
  const { loading, getListPostApi, fetchPostList } = usePostAllPagination()

  const listItems = ref<PostNewsDTO[]>([])
  const pagination = ref<PaginationMeta | null>(null)
  const page = ref('1')
  const limit = 10
  const keySearch = ref<string>('')

  const fetchPage = async (searchQuery: string) => {
    keySearch.value = searchQuery
    await fetchPostList(page.value, limit, keySearch.value)
    listItems.value = getListPostApi.value?.data ?? []
    pagination.value = getListPostApi.value?.pagination ?? null
  }

  watch(page, async (newValue, oldValue) => {
    if (newValue === oldValue) return
    await fetchPage(keySearch.value)
  })

  const { handleChangePage, getTotalPages } = usePagination(
    page,
    computed(() => pagination.value?.totalPages ?? 0)
  )

  const getListItems = computed(() => listItems.value)

  return {
    page,
    limit,
    loading,
    getListItems,
    getTotalPages,
    pagination,
    keySearch,
    handleChangePage,
    fetchPage,
  }
})