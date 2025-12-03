<script lang="ts" setup>
import { ref, watch } from "vue"
import { ROUTES } from '@/shared/constants/routes'
import { useCategoryMainStore } from '@/stores/client/news/useCategoryMainStore'
import type { CategoryNewsDTO } from "@/server/types/dto/v1/news.dto"
import { useCategoryList } from "@/composables/news/useCategoryList"
import { COLUMN } from "@/shared/constants/column"

definePageMeta({
  middleware: ROUTES.PUBLIC.NEWS.children?.CATEGORY.middleware || '',
})

const storeCategoryMain = useCategoryMainStore()
const valueChangePage = ref<boolean|null>(null)
const { getListCategory } = useCategoryList()
const detail: CategoryNewsDTO | null = storeCategoryMain.getDetailNewsCategoryApi

watch(valueChangePage, (newVal) => {
  if(newVal !== null) storeCategoryMain.handleChangePage(newVal)
  valueChangePage.value = null
})

</script>

<template>
  <NewsBreadcrumb :list="getListCategory" :headingCategory="detail?.categoryName"/>

  <div class="container pt-section pb-section">
    <LoadingData v-if="storeCategoryMain.loadingListPost && !storeCategoryMain.getListItems"/>
    <div v-else-if="storeCategoryMain.getListItems && storeCategoryMain.getListItems.length > 0" :class="COLUMN.ROW">
      <div v-for="(item, index) in storeCategoryMain.getListItems" :class="index === 0 ? 'col-12 mb-md' : COLUMN.NEWS">
        <NewsItemTemplate2 :item="item" :listView="index === 0 ? true:false" />
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
