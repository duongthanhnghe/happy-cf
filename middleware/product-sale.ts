import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import type { RouteLocationNormalized } from 'vue-router'
import { ROUTES } from '@/shared/constants/routes';
import { useProductSaleStore } from '@/stores/client/product/useProductSaleStore';

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {

  const storeProductSale = useProductSaleStore()

  try {
    await storeProductSale.fetchListProductSales('',storeProductSale.page,storeProductSale.limit,'')
  } catch (error) {
    console.error('Middleware product-sale error:', error)
    return navigateTo(ROUTES.PUBLIC.ERROR.path)
  }
})
