
<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { useDisplayStore } from "@/stores/shared/useDisplayStore";
import { onBeforeUnmount, onMounted } from 'vue';
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { useProductCategoryStore } from '@/stores/client/product/useProductCategoryStore';
import { useProductMostOrderStore } from '@/stores/client/product/useProductMostOrderStore';
import { useProductViewedStore } from '@/stores/client/product/useProductViewedStore';
import { useImageBlockByPage } from '@/composables/image-block/useImageBlockByPage';
import { IMAGE_BLOCK_PAGES, IMAGE_BLOCK_POSITIONS } from '@/shared/constants/image-block';
import { useProductTexts } from '@/composables/texts/useProductTexts';
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';
import { useVariantGroupAll } from '@/composables/product/useVariantGroupAll';

definePageMeta({
  middleware: ROUTES.PUBLIC.PRODUCT.children?.MOST_ORDER.middleware,
  headerTypeLeft: ROUTES.PUBLIC.PRODUCT.children?.MOST_ORDER.headerTypeLeft,
  showMembershipCTA: ROUTES.PUBLIC.PRODUCT.children?.MOST_ORDER.showMembershipCTA,
})

const { t } = useITranslations()
const storeDisplay = useDisplayStore()
const storeAccount = useAccountStore()
const storeProductCategory = useProductCategoryStore()
const storeProductMostOrder = useProductMostOrderStore()
const storeViewed = useProductViewedStore()
const texts = useProductTexts()
const { fetchImageBlock, getByPosition, dataImageBlock } = useImageBlockByPage()
const { getListVariantGroup, fetchListVariantGroup } = useVariantGroupAll();

const { data, error } = await useAsyncData(
  `product-most-order`,
  async () => {
    if(storeProductMostOrder.getListItems.length > 0) return true

    await storeProductMostOrder.fetchInit()

    if (!dataImageBlock.value[IMAGE_BLOCK_PAGES.PRODUCT_SELLER]) {
      await fetchImageBlock(IMAGE_BLOCK_PAGES.PRODUCT_SELLER, {
        [IMAGE_BLOCK_POSITIONS.HERO]: 1,
      })
    }

    return true
  }
)

const bannerHero = getByPosition(
  IMAGE_BLOCK_PAGES.PRODUCT_SELLER,
  IMAGE_BLOCK_POSITIONS.HERO
)

onMounted(async () => {
  const categoryIds = storeProductCategory.getFlatCategoryList.map(
    (item) => item.id
  )

  if(!categoryIds || categoryIds.length === 0) return

  await fetchListVariantGroup(categoryIds)
})

onBeforeUnmount(() => {
  storeProductMostOrder.resetFilter()
})
</script>

<template>
  <div>
    <Breadcrumb 
      :heading="ROUTES.PUBLIC.PRODUCT.children?.MOST_ORDER.label" 
      :description="`${storeProductMostOrder.getTotalItems} ${t('product.category.text1').text}`" 
      :image="bannerHero[0]?.image">
      <slot>
        <client-only>
        <div v-if="storeDisplay.isMobileTable" :id="storeProductMostOrder.elFilterProduct">
          <ProductFilterMobile 
            :onHandleTogglePopupFilter="storeProductMostOrder.handleTogglePopupFilter"
          />
          <PopupProductFilterMobile 
            categoryName="Tất cả" 
            :variantGroups="getListVariantGroup"
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
          :variantGroups="getListVariantGroup"
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

  <div class="pt-section" v-if="texts['bestseller.desc.main']">
    <div class="bg-gray6">
      <div class="container pt-lg pb-lg">
        <Text color="gray5" :text="texts['bestseller.desc.main']" />
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

  <PopupProductTopFlashSale />
</template>
