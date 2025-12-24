<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { useDisplayStore } from "@/stores/shared/useDisplayStore";
import { onBeforeUnmount } from 'vue';
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { useVariantGroupStore } from '@/stores/client/product/useVariantGroupStore';
import { useProductSaleStore } from '@/stores/client/product/useProductSaleStore';
import { useProductCategoryStore } from '@/stores/client/product/useProductCategoryStore';

definePageMeta({
  middleware: ROUTES.PUBLIC.PRODUCT.children?.SALE.middleware || '',
  headerTypeLeft: ROUTES.PUBLIC.PRODUCT.children?.SALE.headerTypeLeft,
})

const storeDisplay = useDisplayStore()
const storeAccount = useAccountStore()
const storeVariant = useVariantGroupStore()
const storeProductSale = useProductSaleStore()
const storeProductCategory = useProductCategoryStore()

if (storeVariant.listVariantGroup.length === 0) {
  await storeVariant.fetchVariantGroupStore()
}

onBeforeUnmount(() => {
  storeProductSale.resetFilter()
})
</script>

<template>
  <div>
    <Breadcrumb 
      :heading="ROUTES.PUBLIC.PRODUCT.children?.SALE.label" 
      :description="`${storeProductSale.getTotalItems} Sản phẩm`" 
      :image="storeProductSale.IMAGE_AUTH_LOGIN">
      <slot>
        <client-only>
        <div v-if="storeDisplay.isMobileTable" :id="storeProductSale.elFilterProduct">
          <ProductFilterMobile 
            :onHandleTogglePopupFilter="storeProductSale.handleTogglePopupFilter"
          />
          <PopupProductFilterMobile 
            categoryName="Tất cả" 
            :variantGroups="storeVariant.getListVariantGroup"
            :hasFilter="storeProductSale.hasFilter"
            :listCategory="storeProductCategory.getListData"
            :onResetFilter="storeProductSale.resetFilter"
            :isTogglePopupFilter="storeProductSale.isTogglePopupFilter"
            :onHandleTogglePopupFilter="storeProductSale.handleTogglePopupFilter"

            :price-ranges="storeProductSale.PRICE_RANGES"
            :selected-price-ranges="storeProductSale.selectedPriceRanges"
            :on-toggle-price="storeProductSale.togglePriceRange"
            
            :selected-variants="storeProductSale.selectedVariants"
            :on-toggle-variant="storeProductSale.toggleVariant"
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
          :hasFilter="storeProductSale.hasFilter"
          :listCategory="storeProductCategory.getListData"
          :onResetFilter="storeProductSale.resetFilter"

          :price-ranges="storeProductSale.PRICE_RANGES"
          :selected-price-ranges="storeProductSale.selectedPriceRanges"
          :on-toggle-price="storeProductSale.togglePriceRange"
          
          :selected-variants="storeProductSale.selectedVariants"
          :on-toggle-variant="storeProductSale.toggleVariant"
        />
        </client-only>
        <div :class="[{ 'flex-1': storeDisplay.isLaptop }, 'pt-section pb-section']">
          <ProductCategoryMain 
            :loadingData="storeProductSale.loadingData"
            :listData="storeProductSale.getListItems"
            :totalPages="storeProductSale.getTotalPages"
            v-model:page="storeProductSale.page"
            v-model:valueChangePage="storeProductSale.valueChangePage"
          />
        </div>
      </div>
    </div>
  </div>

  <client-only>
    <PopupManageAddress v-if="storeAccount.getUserId" />
  </client-only>
</template>
