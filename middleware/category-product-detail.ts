import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import type { RouteLocationNormalized } from 'vue-router'
import { useProductCategoryDetail } from '@/composables/product/useProductCategoryDetail'
import { ROUTES } from '@/shared/constants/routes';
import { useProductByCategory } from '@/composables/product/useProductByCategory'
import { useCategoryMainStore } from '@/stores/client/product/useCategoryMainStore';
import { useCategoryProductSEO } from '@/composables/seo/useCategoryProductSEO'
import { useProductCategoryChildren } from '@/composables/product/useProductCategoryChildren'

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  const categoryComposable = useProductCategoryDetail()
  const { fetchProductCategoryDetailSlug, getProductCategoryDetail } = categoryComposable
  const { fetchProductByCategory } = useProductByCategory()
  const storeCategoryMain = useCategoryMainStore()
  const { setCategoryProductSEO } = useCategoryProductSEO()
  const { fetchCategoryChildrenList } = useProductCategoryChildren()

  const slug = to.params.categorySlug as string | undefined
  try {
    if (slug) {
      const data = await fetchProductCategoryDetailSlug(slug)
      if(data?.data.id) {
        setCategoryProductSEO(data.data, ROUTES.PUBLIC.NEWS.children?.MAIN.path || '')

        await fetchCategoryChildrenList(data.data.id, false)

        await fetchProductByCategory(data.data.id, 1, storeCategoryMain.limit, storeCategoryMain.filterType)
      }
    } else {
      return navigateTo(ROUTES.PUBLIC.ERROR.path)
    }

    if (!getProductCategoryDetail.value) {
      return navigateTo(ROUTES.PUBLIC.ERROR.path)
    }

  } catch (error) {
    console.error('Middleware category-news error:', error)
    return navigateTo(ROUTES.PUBLIC.ERROR.path)
  }
})
