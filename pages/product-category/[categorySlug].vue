<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { useCategoryMainStore } from '@/stores/client/product/useCategoryMainStore'
import { useDisplayStore } from "@/stores/shared/useDisplayStore";
import { onBeforeUnmount } from 'vue';
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import type { CategoryProductDTO } from "@/server/types/dto/v1/product.dto"

definePageMeta({
  middleware: ROUTES.PUBLIC.PRODUCT.children?.CATEGORY.middleware || '',
  headerTypeLeft: ROUTES.PUBLIC.PRODUCT.children?.CATEGORY.headerTypeLeft,
})

const storeCategoryMain = useCategoryMainStore()
const storeDisplay = useDisplayStore()
const storeAccount = useAccountStore();
const detail: CategoryProductDTO | null = storeCategoryMain.getProductCategoryDetail

onBeforeUnmount(() => {
  storeCategoryMain.resetFilter()
})
</script>

<template>
  <template v-if="detail" >
    <Breadcrumb :heading="detail.categoryName" :description="`${storeCategoryMain.getTotalItems} Sản phẩm`" :image="storeCategoryMain.listBannerCategory">
      <slot>
        <div v-if="storeDisplay.isMobileTable" id="filter-product">
          <ProductFilterMobile :categoryName="detail.categoryName" />
        </div>
        <div v-if="storeCategoryMain.getListCategoryChildren.length > 0" class="mt-ms">
          <ProductChildByCategory :list="storeCategoryMain.getListCategoryChildren" />
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

  <PopupManageAddress v-if="storeAccount.getUserId" />
</template>
