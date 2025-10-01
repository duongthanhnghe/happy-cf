<script lang="ts" setup>
import { ref, watch } from "vue"
import { ROUTES } from '@/shared/constants/routes'
import { useCategoryMainStore } from '@/stores/client/product/useCategoryMainStore'

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
      <v-radio-group v-if="storeCategoryMain.getListCategoryChildren.length > 1" v-model="storeCategoryMain.filterCategory">
        <v-radio
          v-for="item in [{ id: '', categoryName: storeCategoryMain.getDetail.categoryName }, ...storeCategoryMain.getListCategoryChildren]"
          :key="item.id"
          :label="item.categoryName"
          :value="item.id"
        />
      </v-radio-group>
      <v-select
        v-model="storeCategoryMain.filterType"
        :items="[{title: 'Moi nhat',value:''},...storeCategoryMain.filterArray]"
        item-title="title"
        item-value="value"
        hide-details
      />
      <v-range-slider
        v-model="storeCategoryMain.rangePrice"
        step="10"
        :min="0"
        :max="storeCategoryMain.maxPrice"
        thumb-label="always"
      ></v-range-slider>
      <div class="row row-sm" v-if="storeCategoryMain.getListItems && storeCategoryMain.getListItems.length > 0">
        <div v-for="item in storeCategoryMain.getListItems" :key="item.id" class="mb-sm col-6 col-md-4">
          <ProductItemTemplate1 :product="item" background="bg-white" />
        </div>
      </div>
      <div v-else>
        <NoData />
      </div>

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
