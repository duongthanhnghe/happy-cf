import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import type { RouteLocationNormalized } from 'vue-router'
import { ROUTES } from '@/shared/constants/routes';

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  try {
    const searchQuery = (to.query.search as string) || ''
    if(!searchQuery) {
      return navigateTo(ROUTES.PUBLIC.ERROR.path)
    }

  } catch (error) {
    console.error('Middleware product search error:', error)
    return navigateTo(ROUTES.PUBLIC.ERROR.path)
  }
})
