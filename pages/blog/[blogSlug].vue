<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { usePostNewsSEO } from '@/composables/seo/usePostNewsSEO'
import { usePostRelated } from '@/composables/news/usePostRelated'
import { usePostDetail } from '@/composables/news/usePostDetail'
import { useRoute } from 'vue-router'
import { useSeoTitle } from '@/composables/seo/useSEO'

definePageMeta({
  middleware: ROUTES.PUBLIC.NEWS.children?.DETAIL.middleware ?? { middleware: ['post-detail'] },
  showBreadcrumb: ROUTES.PUBLIC.NEWS.children?.DETAIL.showBreadcrumb,
  layout: ROUTES.PUBLIC.PAGE.layout,
})

const limitRelated = 6
const route = useRoute()
const { setNewsSEO } = usePostNewsSEO()
const { fetchDetailPostSlug, getDetailPostApi } = usePostDetail()
const { fetchPostListRelated, getListPostRelatedApi, loading: loadingListRelated } = usePostRelated()
const seoTitle = useSeoTitle()

const slug = route.params.blogSlug as string

const { data, error } = await useAsyncData(
  `post-detail-${slug}`,
  async () => {
    const res = await fetchDetailPostSlug(slug)
    if (res?.data?.id) {
      seoTitle.value = res.data.titleSEO || res.data.title
      setNewsSEO(res.data, '/blog')
      await fetchPostListRelated(slug, limitRelated)
    }
    return res
  }
)

const detail = getDetailPostApi

</script>

<template>
  <template v-if="detail">
    <div class="container">
      <div class="pt-section pb-section">
        <PostDetail :item="detail"/>
      </div>
    </div>
    
    <SectionNewsListSwiper 
      :items="getListPostRelatedApi" 
      :loading="loadingListRelated" 
      pagination
      container="container container-xxl" 
      headingText="Tin liên quan" 
      class="pt-section pb-section bg-gray6"
    />
  </template>
</template>