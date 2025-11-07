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
const detail: CategoryNewsDTO | null = storeCategoryMain.getDetail

watch(valueChangePage, (newVal) => {
  if(newVal !== null) storeCategoryMain.handleChangePage(newVal)
  valueChangePage.value = null
})

</script>

<template>
  <div class="container pt-section pb-section" v-if="detail">
    <h1 v-if="detail.categoryName">{{ detail.categoryName }}</h1>
    <h1 v-else></h1>
    <p>{{ detail.summaryContent }}</p>
    <template v-if="storeCategoryMain.getListItems">
      <div v-for="item in storeCategoryMain.getListItems" :key="item.id">
        <div class="mt-md">
          {{ item.title }}
        </div>
      </div>
    </template>

    <template v-if="storeCategoryMain.getTotalPages && storeCategoryMain.getTotalPages.length > 1">
      <div class="flex gap-sm justify-end">
        <Pagination :totalPages="storeCategoryMain.getTotalPages" v-model:page="storeCategoryMain.page" v-model:valueChangePage="valueChangePage" />
      </div>
    </template>
  </div>
  <div v-else>
    <p>Đang tải dữ liệu...</p>
  </div>
</template>
