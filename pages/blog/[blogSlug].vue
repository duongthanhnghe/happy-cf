<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { usePostDetailStore } from '@/stores/client/news/usePostDetailStore'

definePageMeta({
  middleware: ROUTES.PUBLIC.NEWS.children?.DETAIL.middleware ?? { middleware: ['post-detail'] },
})

const storePostDetail = usePostDetailStore()
const detail = storePostDetail.getDetailPostApi

</script>

<template>
  <template v-if="detail">
    <div class="container">
      <BreadcrumbDefault :custom-label="detail.title" />
      <div class="pt-section pb-section">
        <PostDetail :item="detail"/>
      </div>
    </div>
    
    <SectionNewsListSwiper 
      :items="storePostDetail.getListPostRelatedApi" 
      :loading="storePostDetail.loadingListRelated" 
      pagination
      container="container container-xxl" 
      headingText="Tin liên quan" 
      class="pt-section pb-section bg-gray6"
    />
  </template>
</template>