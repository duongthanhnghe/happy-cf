<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { usePostDetailStore } from '@/stores/client/news/usePostDetailStore'
import type { PostNewsDTO } from '@/server/types/dto/v1/news.dto'

definePageMeta({
  middleware: ROUTES.PUBLIC.NEWS.children?.DETAIL.middleware ?? { middleware: ['post-detail'] },
})

const storePostDetail = usePostDetailStore()
const detail: PostNewsDTO | null = storePostDetail.getDetail

</script>

<template>
  <div class="container pt-section pb-section" v-if="detail">
    <h1 v-if="detail.title">{{ detail.title }}</h1>
    <p>{{ detail.summaryContent }}</p>
    <template v-if="storePostDetail.getListItems">
      <div v-for="item in storePostDetail.getListItems" :key="item.id">
        <div class="mt-md">
          {{ item.title }}
        </div>
      </div>
    </template>
  </div>
  <div v-else>
    <p>Đang tải dữ liệu...</p>
  </div>
</template>