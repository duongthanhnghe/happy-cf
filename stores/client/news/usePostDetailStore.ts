import { watch, computed } from "vue";
import { defineStore } from "pinia";
import { ROUTES } from '@/shared/constants/routes'
import { usePostDetail } from '@/composables/news/usePostDetail'
import { usePostRelated } from '@/composables/news/usePostRelated'
import { usePostNewsSEO } from '@/composables/seo/usePostNewsSEO'

export const usePostDetailStore = defineStore("PostDetailStore", () => {
  const { getDetailPostApi } = usePostDetail()
  const { getListPostRelatedApi, loading: loadingListRelated } = usePostRelated()
  const { setNewsSEO } = usePostNewsSEO()

  const limitRelated = 12
  const routePath = ROUTES.PUBLIC.NEWS.children?.DETAIL?.path ?? '/post'

  watch(getDetailPostApi, (newValue) => {
    if(newValue) {
      setNewsSEO(newValue, routePath)
    }
  }, { immediate: true })

  const getDetail = computed(() => getDetailPostApi.value);

  const getListItems = computed(() => getListPostRelatedApi.value);

  return {
    getDetail,
    getListItems,
    limitRelated,
    loadingListRelated,
  };
});
