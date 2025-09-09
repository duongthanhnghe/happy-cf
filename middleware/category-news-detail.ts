import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import type { RouteLocationNormalized } from 'vue-router'
import { useNewsCategoryDetail } from '@/composables/news/useNewsCategoryDetail'
import { ROUTES } from '@/shared/constants/routes';

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  const categoryComposable = useNewsCategoryDetail()
  const { fetchDetailNewsCategory, fetchDetailNewsCategorySlug, getDetailNewsCategoryApi } = categoryComposable

  const id = to.params.id as string | undefined
  const slug = to.params.categorySlug as string | undefined
  try {
    if (id) {
      await fetchDetailNewsCategory(id)
    } else if (slug) {
      await fetchDetailNewsCategorySlug(slug)
    } else {
      return navigateTo(ROUTES.PUBLIC.ERROR.path)
    }

    if (!getDetailNewsCategoryApi.value) {
      return navigateTo(ROUTES.PUBLIC.ERROR.path)
    }
  } catch (error) {
    console.error('Middleware category-news error:', error)
    return navigateTo(ROUTES.PUBLIC.ERROR.path)
  }
})
