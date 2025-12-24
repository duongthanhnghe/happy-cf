
<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { useDisplayStore } from "@/stores/shared/useDisplayStore";
import { onBeforeUnmount } from 'vue';
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { useVariantGroupStore } from '@/stores/client/product/useVariantGroupStore';
import { useProductCategoryStore } from '@/stores/client/product/useProductCategoryStore';
import { useProductMostOrderStore } from '@/stores/client/product/useProductMostOrderStore';

definePageMeta({
  middleware: ROUTES.PUBLIC.PRODUCT.children?.MOST_ORDER.middleware || '',
  headerTypeLeft: ROUTES.PUBLIC.PRODUCT.children?.MOST_ORDER.headerTypeLeft,
})

const storeDisplay = useDisplayStore()
const storeAccount = useAccountStore()
const storeVariant = useVariantGroupStore()
const storeProductCategory = useProductCategoryStore()
const storeProductMostOrder = useProductMostOrderStore()

if (storeVariant.listVariantGroup.length === 0) {
  await storeVariant.fetchVariantGroupStore()
}

onBeforeUnmount(() => {
  storeProductMostOrder.resetFilter()
})
</script>

<template>
  <div>
    <Breadcrumb 
      :heading="ROUTES.PUBLIC.PRODUCT.children?.MOST_ORDER.label" 
      :description="`${storeProductMostOrder.getTotalItems} Sản phẩm`" 
      :image="storeProductMostOrder.IMAGE_AUTH_LOGIN">
      <slot>
        <client-only>
        <div v-if="storeDisplay.isMobileTable" :id="storeProductMostOrder.elFilterProduct">
          <ProductFilterMobile 
            :onHandleTogglePopupFilter="storeProductMostOrder.handleTogglePopupFilter"
          />
          <PopupProductFilterMobile 
            categoryName="Tất cả" 
            :variantGroups="storeVariant.getListVariantGroup"
            :hasFilter="storeProductMostOrder.hasFilter"
            :listCategory="storeProductCategory.getListData"
            :onResetFilter="storeProductMostOrder.resetFilter"
            :isTogglePopupFilter="storeProductMostOrder.isTogglePopupFilter"
            :onHandleTogglePopupFilter="storeProductMostOrder.handleTogglePopupFilter"

            :price-ranges="storeProductMostOrder.PRICE_RANGES"
            :selected-price-ranges="storeProductMostOrder.selectedPriceRanges"
            :on-toggle-price="storeProductMostOrder.togglePriceRange"
            
            :selected-variants="storeProductMostOrder.selectedVariants"
            :on-toggle-variant="storeProductMostOrder.toggleVariant"
          />
        </div>
        </client-only>
      </slot>
    </Breadcrumb>

    <div class="container container-xxl" >
      <div :class="[{ 'flex gap-md align-start': storeDisplay.isLaptop }]">
        <client-only>
        <ProductFilterPC 
          v-if="storeDisplay.isLaptop"
          categoryName="Tất cả"
          :variantGroups="storeVariant.getListVariantGroup"
          :hasFilter="storeProductMostOrder.hasFilter"
          :listCategory="storeProductCategory.getListData"
          :onResetFilter="storeProductMostOrder.resetFilter"

          :price-ranges="storeProductMostOrder.PRICE_RANGES"
          :selected-price-ranges="storeProductMostOrder.selectedPriceRanges"
          :on-toggle-price="storeProductMostOrder.togglePriceRange"
          
          :selected-variants="storeProductMostOrder.selectedVariants"
          :on-toggle-variant="storeProductMostOrder.toggleVariant"
        />
        </client-only>
        <div :class="[{ 'flex-1': storeDisplay.isLaptop }, 'pt-section pb-section']">
          <ProductCategoryMain 
            :loadingData="storeProductMostOrder.loadingData"
            :listData="storeProductMostOrder.getListItems"
            :totalPages="storeProductMostOrder.getTotalPages"
            v-model:page="storeProductMostOrder.page"
            v-model:valueChangePage="storeProductMostOrder.valueChangePage"
          />
        </div>
      </div>
    </div>
  </div>

  <client-only>
    <PopupManageAddress v-if="storeAccount.getUserId" />
  </client-only>
</template>
