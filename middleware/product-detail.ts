import type { RouteLocationNormalized } from 'vue-router'
import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import { useProductDetail } from '@/composables/product/useProductDetail'
import { useProductRelated } from '@/composables/product/useProductRelated'
import { ROUTES } from '@/shared/constants/routes';
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore'
import { useAccountStore } from "@/stores/client/users/useAccountStore";
import { useAvailableVouchersForOrder } from "@/composables/voucher/useAvailableVouchers";
import { useProductReviewByProduct } from '@/composables/product-review/useProductReviewByProduct'
import { useProductSEO } from '@/composables/seo/useProductSEO'

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  const { getDetailProduct, fetchDetailProduct } = useProductDetail()
  const { setProductSEO } = useProductSEO()
  const { fetchProductRelated } = useProductRelated()
  const { fetchAvailableVouchers } = useAvailableVouchersForOrder();
  const { fetchListReview } = useProductReviewByProduct()
  
  const storeDetail = useProductDetailStore()
  const storeAccount = useAccountStore()
  const slug = to.params.slug as string | undefined

  try {
    if (slug) {
      const data = await fetchDetailProduct(slug)
      if(data?.data.id) {
        const userId = storeAccount.getUserId || '';
        const categoryIds = data?.data.categoryId ? [data?.data.categoryId] : [];
        const orderTotal = data?.data.priceDiscounts;
        const routePath = ROUTES.PUBLIC.PRODUCT.children?.DETAIL?.path ?? '/product'

        setProductSEO(data.data, routePath)

        if(categoryIds && orderTotal){
          await fetchAvailableVouchers({
            userId,
            categoryIds,
            orderTotal
          })
        }

        await fetchProductRelated(slug, storeDetail.limitRelated)

        await fetchListReview(data.data.id, 1, storeDetail.limitReview)
        
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
