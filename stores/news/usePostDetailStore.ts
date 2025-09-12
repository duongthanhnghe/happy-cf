import { ref, watch, computed } from "vue";
import { defineStore } from "pinia";
import { ROUTES } from '@/shared/constants/routes'
import { usePostDetail } from '@/composables/news/usePostDetail'
import { usePostRelated } from '@/composables/news/usePostRelated'
import type { PostNewsDTO } from '@/server/types/dto/news.dto'
import { usePostNewsSEO } from '@/composables/seo/usePostNewsSEO'

export const usePostDetailStore = defineStore("PostDetailStore", () => {
  const { getDetailPostApi } = usePostDetail()
  const { getListPostRelatedApi } = usePostRelated()
  const { setNewsSEO } = usePostNewsSEO()

  const listItems = ref<PostNewsDTO[]|null>(null);
  const limitRelated = 12
  const routePath = ROUTES.PUBLIC.NEWS.children?.DETAIL?.path ?? '/post'

  watch(getDetailPostApi, (newValue) => {
    if(newValue) {
      setNewsSEO(newValue, routePath)
    }
  }, { immediate: true })

  watch(getListPostRelatedApi, (newValue) => {
    if (newValue && newValue) {
      listItems.value = newValue
    }
  })

  const getDetail = computed(() => getDetailPostApi.value);

  const getListItems = computed(() => listItems.value);

  return {
    getDetail,
    getListItems,
    limitRelated,
  };
});
