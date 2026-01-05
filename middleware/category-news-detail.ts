import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import type { RouteLocationNormalized } from 'vue-router'
import { ROUTES } from '@/shared/constants/routes';

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  const slug = to.params.categorySlug as string | undefined
  try {
    if (!slug) {
      return navigateTo(ROUTES.PUBLIC.ERROR.path)
    }

  } catch (error) {
    console.error('Middleware category-news error:', error)
    return navigateTo(ROUTES.PUBLIC.ERROR.path)
  }
})
