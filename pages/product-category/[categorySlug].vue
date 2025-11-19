<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { useCategoryMainStore } from '@/stores/client/product/useCategoryMainStore'
import { IMAGE_AUTH_LOGIN } from '@/const/image'
import { useDisplayStore } from "@/stores/shared/useDisplayStore";
import type { CategoryProductDTO } from "@/server/types/dto/v1/product.dto"
import { onBeforeUnmount } from 'vue';

definePageMeta({
  middleware: ROUTES.PUBLIC.PRODUCT.children?.CATEGORY.middleware || '',
})

const storeCategoryMain = useCategoryMainStore()
const storeDisplay = useDisplayStore()
const detail: CategoryProductDTO | null = storeCategoryMain.getProductCategoryDetail

onBeforeUnmount(() => {
  storeCategoryMain.resetFilter()
})
</script>

<template>
  <template v-if="detail" >
    <Breadcrumb :heading="detail.categoryName" :description="`${storeCategoryMain.getTotalItems} Ket qua`" :image="IMAGE_AUTH_LOGIN">
      <slot v-if="storeDisplay.isMobileTable">
        <div id="filter-product">
          <ProductFilterMobile :categoryName="detail.categoryName" />
        </div>
      </slot>
    </Breadcrumb>

    <div class="container container-xxl" >
      <div v-if="storeDisplay.isLaptop" class="flex gap-md align-start">
        <ProductFilterPC :categoryName="detail.categoryName" />
        <div class="flex-1 pt-section pb-section">
          <ProductCategoryMain :detail="detail"/>
        </div>
      </div>
      <template v-else>
        <div class="pt-section pb-section">
          <ProductCategoryMain :detail="detail"/>
        </div>
      </template>
    </div>
  </template>
</template>
