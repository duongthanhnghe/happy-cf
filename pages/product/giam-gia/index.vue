<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { useDisplayStore } from "@/stores/shared/useDisplayStore";
import { onBeforeUnmount, onMounted } from 'vue';
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { useVariantGroupStore } from '@/stores/client/product/useVariantGroupStore';
import { useProductSaleStore } from '@/stores/client/product/useProductSaleStore';
import { useProductCategoryStore } from '@/stores/client/product/useProductCategoryStore';
import { useProductViewedStore } from '@/stores/client/product/useProductViewedStore';
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';
import { useImageBlockByPage } from '@/composables/image-block/useImageBlockByPage';
import { IMAGE_BLOCK_PAGES, IMAGE_BLOCK_POSITIONS } from '@/shared/constants/image-block';

definePageMeta({
  middleware: ROUTES.PUBLIC.PRODUCT.children?.SALE.middleware,
  headerTypeLeft: ROUTES.PUBLIC.PRODUCT.children?.SALE.headerTypeLeft,
  showMembershipCTA: ROUTES.PUBLIC.PRODUCT.children?.SALE.showMembershipCTA,
})

const storeDisplay = useDisplayStore()
const storeAccount = useAccountStore()
const storeVariant = useVariantGroupStore()
const storeProductSale = useProductSaleStore()
const storeProductCategory = useProductCategoryStore()
const storeViewed = useProductViewedStore()
const { t } = useITranslations()
const { fetchImageBlock, getByPosition, dataImageBlock } = useImageBlockByPage()

const { data, error } = await useAsyncData(
  `product-sale`,
  async () => {
    if(storeProductSale.getListItems.length > 0) return true

    await storeProductSale.fetchInit()

    if (!dataImageBlock.value[IMAGE_BLOCK_PAGES.PRODUCT_SALE]) {
      await fetchImageBlock(IMAGE_BLOCK_PAGES.PRODUCT_SALE, {
        [IMAGE_BLOCK_POSITIONS.HERO]: 1,
      })
    }

    return true
  }
)

const bannerHero = getByPosition(
  IMAGE_BLOCK_PAGES.PRODUCT_SALE,
  IMAGE_BLOCK_POSITIONS.HERO
)

onMounted(async () => {
  if (storeVariant.listVariantGroup.length === 0) {
    await storeVariant.fetchVariantGroupStore()
  }
})

onBeforeUnmount(() => {
  storeProductSale.resetFilter()
})
</script>

<template>
  <div>
    <Breadcrumb 
      :heading="ROUTES.PUBLIC.PRODUCT.children?.SALE.label" 
      :description="`${storeProductSale.getTotalItems} ${t('product.category.text1').text}`" 
      :image="bannerHero[0]?.image">
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

  <div class="pt-section" v-if="t('sale.desc.main')">
    <div class="bg-gray6">
      <div class="container pt-lg pb-lg">
        <Text color="gray5" :text="t('sale.desc.main')" />
      </div>
    </div>
  </div>

  <client-only>
    <SectionProductListSwiper 
      v-if="storeViewed.listItems && storeViewed.listItems.length > 0" 
      :items="storeViewed.listItems" 
      :loading="storeViewed.loading" 
      container="container container-xxl" 
      :headingText="t('product.section.text1')" 
      class="pt-section pb-section"
      fullScreen
    />
    <div v-else class="pt-section"></div>

    <PopupManageAddress v-if="storeAccount.getUserId" />
  </client-only>
</template>
