<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { usePostDetailStore } from '@/stores/client/news/usePostDetailStore'

definePageMeta({
  middleware: ROUTES.PUBLIC.NEWS.children?.DETAIL.middleware ?? { middleware: ['post-detail'] },
})

const storePostDetail = usePostDetailStore()
const detail = storePostDetail.getDetailPostApi
const breakpoints = {
  320: { slidesPerView: 2.3, spaceBetween: 10 },
  640: { slidesPerView: 3, spaceBetween: 10 },
  1024: { slidesPerView: 3, spaceBetween: 10 },
  1200: { slidesPerView: 4, spaceBetween: 24 }
}

</script>

<template>
  <div v-if="detail" class="container pt-section pb-section" >
    <PostDetail :item="detail"/>

    <ListPostRelated :items="storePostDetail.getListPostRelatedApi" :loading="storePostDetail.loadingListRelated" :breakpoints="breakpoints" headingText="Tin lien quan" />
  </div>
</template>