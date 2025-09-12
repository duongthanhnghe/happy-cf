<script lang="ts" setup>
import { ref, watch } from "vue"
import { ROUTES } from '@/shared/constants/routes'
import { useCategoryMainStore } from '@/stores/product/useCategoryMainStore'

definePageMeta({
  middleware: ROUTES.PUBLIC.PRODUCT.children?.CATEGORY.middleware || '',
})

const storeCategoryMain = useCategoryMainStore()

const valueChangePage = ref<boolean|null>(null)

watch(valueChangePage, (newVal) => {
  if(newVal !== null) storeCategoryMain.handleChangePage(newVal)
  valueChangePage.value = null
})
</script>

<template>
  <div>
    <div class="container pt-section pb-section" v-if="storeCategoryMain.getDetail">
      <h1 v-if="storeCategoryMain.getDetail.categoryName">{{ storeCategoryMain.getDetail.categoryName }}</h1>
      <h1 v-else></h1>
      <p>{{ storeCategoryMain.getDetail.description }}</p>
      <template v-if="storeCategoryMain.getListItems">
        <div v-for="item in storeCategoryMain.getListItems" :key="item.id">
          <div class="mt-md">
            {{ item.productName }}
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
  </div>
</template>
