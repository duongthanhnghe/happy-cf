import type { RouteLocationNormalized } from 'vue-router'
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useProductDetail } from '@/composables/product/useProductDetail'
import { useProductRelated } from '@/composables/product/useProductRelated'
import { ROUTES } from '@/shared/constants/routes';
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore'

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  const { getDetailProduct, fetchDetailProduct } = useProductDetail()
  const { fetchProductRelated } = useProductRelated()
  
  const storeDetail = useProductDetailStore()
  const slug = to.params.slug as string | undefined

  try {
    if (slug) {
      const data = await fetchDetailProduct(slug)
      if(data?.data.id) {
        await fetchProductRelated(slug, storeDetail.limitRelated)
      }
    } else {
      return navigateTo(ROUTES.PUBLIC.ERROR.path)
    }

    if (!getDetailProduct.value) {
      return navigateTo(ROUTES.PUBLIC.ERROR.path)
    }

  } catch (error) {
    console.error('Middleware product detail error:', error)
    return navigateTo(ROUTES.PUBLIC.ERROR.path)
  }
})
