<script lang="ts" setup>
import { ref, watch } from "vue"
import { ROUTES } from '@/shared/constants/routes'
import { useMainStore } from '@/stores/client/news/useMainStore'
import { COLUMN } from "@/shared/constants/column"
import { useRoute } from 'vue-router'

definePageMeta({
  middleware: ROUTES.PUBLIC.NEWS.children?.SEARCH.middleware || '',
})

const storeNews = useMainStore()
const valueChangePageNews = ref<boolean|null>(null)
const route = useRoute()

await useAsyncData('post-search-page', async () => {
  const searchQuery = (route.query.search as string) || ''
  await Promise.all([
    storeNews.fetchPage(searchQuery),
  ])
})

watch(valueChangePageNews, (newVal) => {
  if(newVal !== null) storeNews.handleChangePage(newVal)
  valueChangePageNews.value = null
})

</script>

<template>
  <div class="container container-xxl ">
    <BreadcrumbDefault />
    <div class="pt-lg pb-lg">
      <Text :text="`Kết quả tìm kiếm: ${storeNews.pagination?.total} bài viết`" size="md" color="black" weight="semibold" class="mb-ms"/>
      
      <LoadingData v-if="storeNews.loading && !storeNews.getListItems"/>
      <div v-else-if="storeNews.getListItems && storeNews.getListItems.length > 0" :class="COLUMN.ROW">
        <div v-for="item in storeNews.getListItems" :class="COLUMN.NEWS_SEARCH">
          <NewsItemTemplate2 :item="item" />
        </div>
      </div>
      <NoData v-else/>

      <template v-if="storeNews.getTotalPages && storeNews.getTotalPages.length > 1">
        <div class="flex gap-sm justify-end">
          <Pagination :totalPages="storeNews.getTotalPages" v-model:page="storeNews.page" v-model:valueChangePage="valueChangePageNews" />
        </div>
      </template>
    </div>
  </div>
</template>
