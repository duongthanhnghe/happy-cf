<script lang="ts" setup>
import type { CategoryProductDTO } from '@/server/types/dto/v1/product.dto';
import { COLUMN } from '@/shared/constants/column';
import { useCategoryMainStore } from '@/stores/client/product/useCategoryMainStore'
const storeCategoryMain = useCategoryMainStore()
const props = defineProps<{
  detail: CategoryProductDTO | null;
}>();
</script>
<template>
  <template v-if="props.detail">
    <LoadingData v-if="storeCategoryMain.loadingData && storeCategoryMain.getListItems === null" />
    <div v-else-if="storeCategoryMain.getListItems && storeCategoryMain.getListItems.length > 0" :class="COLUMN.ROW">
      <div v-for="item in storeCategoryMain.getListItems" :key="item.id" :class="COLUMN.PRODUCT">
        <ProductItemTemplate1 :product="item" background="bg-white" />
      </div>
    </div>
    <div v-else>
      <NoData />
    </div>

    <template v-if="storeCategoryMain.getTotalPages && storeCategoryMain.getTotalPages.length > 1">
      <div class="flex gap-sm justify-end">
        <Pagination :totalPages="storeCategoryMain.getTotalPages" v-model:page="storeCategoryMain.page" v-model:valueChangePage="storeCategoryMain.valueChangePage" />
      </div>
    </template>

    <Text color="gray5" v-if="props.detail.description" class="mt-md" :text="props.detail.description" />
  </template>
</template>