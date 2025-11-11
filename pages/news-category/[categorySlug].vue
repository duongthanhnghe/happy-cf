<script lang="ts" setup>
import { ref, watch } from "vue"
import { ROUTES } from '@/shared/constants/routes'
import { useCategoryMainStore } from '@/stores/client/news/useCategoryMainStore'
import type { CategoryNewsDTO } from "@/server/types/dto/v1/news.dto"

definePageMeta({
  middleware: ROUTES.PUBLIC.NEWS.children?.CATEGORY.middleware || '',
})

const storeCategoryMain = useCategoryMainStore()
const valueChangePage = ref<boolean|null>(null)
const detail: CategoryNewsDTO | null = storeCategoryMain.getDetailNewsCategoryApi

watch(valueChangePage, (newVal) => {
  if(newVal !== null) storeCategoryMain.handleChangePage(newVal)
  valueChangePage.value = null
})

</script>

<template>
  <div v-if="detail" class="container pt-section pb-section">
    <h1 v-if="detail.categoryName">{{ detail.categoryName }}</h1>
    <h1 v-else></h1>
    <p>{{ detail.summaryContent }}</p>

    <LoadingData v-if="storeCategoryMain.loadingListPost && storeCategoryMain.getListItems === null"/>
    <div 
      v-else-if="storeCategoryMain.getListItems && storeCategoryMain.getListItems.length > 0" 
      v-for="item in storeCategoryMain.getListItems" 
      :key="item.id">
      <div class="mt-md">
        {{ item.title }}
      </div>
    </div>
    <NoData v-else/>

    <template v-if="storeCategoryMain.getTotalPages && storeCategoryMain.getTotalPages.length > 1">
      <div class="flex gap-sm justify-end">
        <Pagination :totalPages="storeCategoryMain.getTotalPages" v-model:page="storeCategoryMain.page" v-model:valueChangePage="valueChangePage" />
      </div>
    </template>
  </div>
</template>
