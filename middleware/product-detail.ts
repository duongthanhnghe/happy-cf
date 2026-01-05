import type { RouteLocationNormalized } from 'vue-router'
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { ROUTES } from '@/shared/constants/routes';

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  const slug = to.params.slug as string | undefined

  try {
    if (!slug) {
      return navigateTo(ROUTES.PUBLIC.ERROR.path)
    }

  } catch (error) {
    console.error('Middleware product detail error:', error)
    return navigateTo(ROUTES.PUBLIC.ERROR.path)
  }
})
