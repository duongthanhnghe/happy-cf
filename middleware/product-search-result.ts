import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import type { RouteLocationNormalized } from 'vue-router'
import { ROUTES } from '@/shared/constants/routes';
import { useProductSearch } from '@/composables/product/useProductSearch';
import { useSearchStore } from '@/stores/client/product/useSearchStore';

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  const { getListProductSearch, fetchListProductSearch } = useProductSearch()

  const store = useSearchStore()

  try {
    const searchQuery = (to.query.search as string) || ''
    store.txtSearch = searchQuery

    await fetchListProductSearch(searchQuery, 1, store.limit, )
    if (getListProductSearch.value) {
      store.items = getListProductSearch.value
    }

  } catch (error) {
    console.error('Middleware product search error:', error)
    return navigateTo(ROUTES.PUBLIC.ERROR.path)
  }
})
