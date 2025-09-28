<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { usePostDetailStore } from '@/stores/client/news/usePostDetailStore'

definePageMeta({
  middleware: ROUTES.PUBLIC.NEWS.children?.DETAIL.middleware ?? { middleware: ['post-detail'] },
})

const storePostDetail = usePostDetailStore()

</script>

<template>
  <div>
    <div class="container pt-section pb-section" v-if="storePostDetail.getDetail">
      <h1 v-if="storePostDetail.getDetail.title">{{ storePostDetail.getDetail.title }}</h1>
      <p>{{ storePostDetail.getDetail.summaryContent }}</p>
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
  </div>
</template>