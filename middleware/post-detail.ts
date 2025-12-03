import type { RouteLocationNormalized } from 'vue-router'
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { usePostDetail } from '@/composables/news/usePostDetail'
import { ROUTES } from '@/shared/constants/routes';
import { usePostDetailStore } from '@/stores/client/news/usePostDetailStore';
import { usePostRelated } from '@/composables/news/usePostRelated'
import { usePostNewsSEO } from '@/composables/seo/usePostNewsSEO'

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  const { fetchDetailPostSlug, getDetailPostApi } = usePostDetail()
  const { fetchPostListRelated } = usePostRelated()
  const storePostDetail = usePostDetailStore()
  const { setNewsSEO } = usePostNewsSEO()

  const slug = to.params.blogSlug as string | undefined
  const routePath = ROUTES.PUBLIC.NEWS.children?.DETAIL?.path ?? '/post'

  try {
    if (slug) {
      const data = await fetchDetailPostSlug(slug)
      if(data?.data.id) {
        setNewsSEO(data.data, routePath)

        await fetchPostListRelated(slug, storePostDetail.limitRelated)
      }
    } else {
      return navigateTo(ROUTES.PUBLIC.ERROR.path)
    }

    if (!getDetailPostApi.value) {
      return navigateTo(ROUTES.PUBLIC.ERROR.path)
    }

  } catch (error) {
    console.error('Middleware post-news error:', error)
    return navigateTo(ROUTES.PUBLIC.ERROR.path)
  }
})
