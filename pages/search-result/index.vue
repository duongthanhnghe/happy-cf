<script lang="ts" setup>
import { ref, watch, onMounted } from "vue"
import { ROUTES } from '@/shared/constants/routes'
import { useMainStore } from '@/stores/client/news/useMainStore'

definePageMeta({
  middleware: ROUTES.PUBLIC.NEWS.children?.MAIN.middleware || '',
})

const storeNews = useMainStore()
const valueChangePageNews = ref<boolean|null>(null)
const totalResult = ref(0)

watch(valueChangePageNews, (newVal) => {
  if(newVal !== null) storeNews.handleChangePage(newVal)
  valueChangePageNews.value = null
})

onMounted(() => {
  if (storeNews.getTotalPages) {
    totalResult.value = storeNews.getTotalPages.length
  }
})

</script>

<template>
  <Breadcrumb :heading="`${totalResult} Ket qua tim kiem`" description="123" />
  <div class="container pt-section pb-section">
    <template v-if="storeNews.getListItems">
      <div v-for="item in storeNews.getListItems" :key="item.id">
        <div class="mt-md">
          {{ item.title }}
        </div>
      </div>
    </template>

    <template v-if="storeNews.getTotalPages && storeNews.getTotalPages.length > 1">
      <div class="flex gap-sm justify-end">
        <Pagination :totalPages="storeNews.getTotalPages" v-model:page="storeNews.page" v-model:valueChangePage="valueChangePageNews" />
      </div>
    </template>
  </div>
</template>
