import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import type { RouteLocationNormalized } from 'vue-router'
import { usePostAllPagination } from '@/composables/news/usePostAllPagination'
import { ROUTES } from '@/shared/constants/routes';
import { useMainStore } from '@/stores/client/news/useMainStore';

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  const composable = usePostAllPagination()
  const { getListPostApi, fetchPostList } = composable
  const store = useMainStore()

  try {
    const searchQuery = (to.query.search as string) || ''

    await fetchPostList(store.page, store.limit, searchQuery)

    if (!getListPostApi.value) {
      return navigateTo(ROUTES.PUBLIC.ERROR.path)
    } else {
      store.listItems = getListPostApi.value.data
      store.pagination = getListPostApi.value?.pagination
    }

  } catch (error) {
    console.error('Middleware news main error:', error)
    return navigateTo(ROUTES.PUBLIC.ERROR.path)
  }
})
