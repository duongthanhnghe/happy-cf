import { defineNuxtRouteMiddleware, navigateTo } from 'nuxt/app'
import type { RouteLocationNormalized } from 'vue-router'
import { useNewsCategoryDetail } from '@/composables/news/useNewsCategoryDetail'
import { ROUTES } from '@/shared/constants/routes';
import { usePostByCategory } from '@/composables/news/usePostByCategory'
import { useCategoryMainStore } from '@/stores/client/news/useCategoryMainStore';
import { useCategoryNewsSEO } from '@/composables/seo/useCategoryNewsSEO'
import { useCategoryList } from '@/composables/news/useCategoryList';

export default defineNuxtRouteMiddleware(async (to: RouteLocationNormalized) => {
  const categoryComposable = useNewsCategoryDetail()
  const { fetchDetailNewsCategory, fetchDetailNewsCategorySlug, getDetailNewsCategoryApi } = categoryComposable
  const { fetchPostByCategory, getPostByCategoryApi } = usePostByCategory()
  const storeCategoryMain = useCategoryMainStore()
  const { setCategoryNewsSEO } = useCategoryNewsSEO()
  const { getListCategory, fetchCategoryList} = useCategoryList()

  const id = to.params.id as string | undefined
  const slug = to.params.categorySlug as string | undefined
  try {
    if (id) {
      await fetchDetailNewsCategory(id)
    } else if (slug) {
      const data = await fetchDetailNewsCategorySlug(slug)
      if(data?.data.id) {
        setCategoryNewsSEO(data.data, ROUTES.PUBLIC.NEWS.children?.MAIN.path || '')
        
        await fetchPostByCategory(data.data.id, 1, storeCategoryMain.limit)
        storeCategoryMain.listItems = getPostByCategoryApi.value?.data

        if(!getListCategory.value || getListCategory.value.length === 0) await fetchCategoryList()

      }
    } else {
      return navigateTo(ROUTES.PUBLIC.ERROR.path)
    }

    if (!getDetailNewsCategoryApi.value) {
      return navigateTo(ROUTES.PUBLIC.ERROR.path)
    }

  } catch (error) {
    console.error('Middleware category-news error:', error)
    return navigateTo(ROUTES.PUBLIC.ERROR.path)
  }
})
