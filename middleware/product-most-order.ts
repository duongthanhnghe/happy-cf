import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import type { RouteLocationNormalized } from 'vue-router'
import { ROUTES } from '@/shared/constants/routes';
import { useProductMostOrderStore } from '@/stores/client/product/useProductMostOrderStore';

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {

  const storeProductMostOrder = useProductMostOrderStore()

  try {
    await storeProductMostOrder.fetchListProductMostOrder('',storeProductMostOrder.page,storeProductMostOrder.limit,'')
  } catch (error) {
    console.error('Middleware product-most-order error:', error)
    return navigateTo(ROUTES.PUBLIC.ERROR.path)
  }
})
