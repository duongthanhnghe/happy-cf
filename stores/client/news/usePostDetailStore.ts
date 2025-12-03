import { defineStore } from "pinia";
import { usePostDetail } from '@/composables/news/usePostDetail'
import { usePostRelated } from '@/composables/news/usePostRelated'

export const usePostDetailStore = defineStore("PostDetailStore", () => {
  const { getDetailPostApi } = usePostDetail()
  const { getListPostRelatedApi, loading: loadingListRelated } = usePostRelated()

  const limitRelated = 6

  return {
    getDetailPostApi,
    limitRelated,
    loadingListRelated,
    getListPostRelatedApi,
  };
});
