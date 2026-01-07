<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { useCategoryMainStore } from '@/stores/client/product/useCategoryMainStore'
import { useDisplayStore } from "@/stores/shared/useDisplayStore";
import { computed, onBeforeUnmount } from 'vue';
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { useVariantGroupStore } from '@/stores/client/product/useVariantGroupStore';
import { useProductViewedStore } from '@/stores/client/product/useProductViewedStore';
import { useImageBlockByPage } from '@/composables/image-block/useImageBlockByPage';
import { IMAGE_BLOCK_PAGES, IMAGE_BLOCK_POSITIONS } from '@/shared/constants/image-block';
import { useProductCategoryDetail } from '@/composables/product/useProductCategoryDetail';
import { useCategoryProductSEO } from '@/composables/seo/useCategoryProductSEO';
import { useProductCategoryChildren } from '@/composables/product/useProductCategoryChildren';
import { useRoute } from 'vue-router'
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';

definePageMeta({
  middleware: ROUTES.PUBLIC.PRODUCT.children?.CATEGORY.middleware || '',
  headerTypeLeft: ROUTES.PUBLIC.PRODUCT.children?.CATEGORY.headerTypeLeft,
})

const { t } = useITranslations()
const storeCategoryMain = useCategoryMainStore()
const storeDisplay = useDisplayStore()
const storeAccount = useAccountStore()
const storeVariant = useVariantGroupStore()
const storeViewed = useProductViewedStore()
const route = useRoute()

const { fetchImageBlock, getByPosition, dataImageBlock } = useImageBlockByPage()
const { fetchProductCategoryDetailSlug, getProductCategoryDetail } = useProductCategoryDetail()
const { setCategoryProductSEO } = useCategoryProductSEO()
const { fetchCategoryChildrenList } = useProductCategoryChildren()

const slug = route.params.categorySlug as string

const { data, error } = await useAsyncData(
  `product-category-${slug}`,
  async () => {
    const data = await fetchProductCategoryDetailSlug(slug)
    if(data?.data.id) {
      setCategoryProductSEO(data.data, ROUTES.PUBLIC.NEWS.children?.MAIN.path || '')

      await fetchCategoryChildrenList(data.data.id, false)

      await storeCategoryMain.fetchInit(data.data.id)

      if (storeVariant.listVariantGroup.length === 0) {
        await storeVariant.fetchVariantGroupStore()
      }

      if (!dataImageBlock.value[IMAGE_BLOCK_PAGES.CATEGORY] && !data.data?.banner) {
        await fetchImageBlock(IMAGE_BLOCK_PAGES.CATEGORY, {
          [IMAGE_BLOCK_POSITIONS.HERO]: 1,
        })
      }
    }

    return false
  }
)

const detail = storeCategoryMain.getProductCategoryDetail

const listBannerCategory = computed(() => {
  if (!storeCategoryMain.getListCategoryChildren || storeCategoryMain.getListCategoryChildren.length === 0) {
    if(!getProductCategoryDetail) return
    return getProductCategoryDetail.value?.banner
  }

  return storeCategoryMain.getListCategoryChildren
    .map(item => item.banner)
    .filter(Boolean)
})

const bannerHero = getByPosition(
  IMAGE_BLOCK_PAGES.CATEGORY,
  IMAGE_BLOCK_POSITIONS.HERO
)


onBeforeUnmount(() => {
  storeCategoryMain.resetFilter()
})
</script>

<template>
  <div v-if="detail" >
    <Breadcrumb 
      :heading="detail.categoryName" 
      :description="`${storeCategoryMain.getTotalItems} ${t('product.category.text1').text}`" 
      :image="listBannerCategory && listBannerCategory?.length > 0 ? listBannerCategory : (detail.banner || bannerHero[0]?.image)">
      <slot>
        <div v-if="storeDisplay.isMobileTable" :id="storeCategoryMain.elFilterProduct">
          <ProductFilterMobile 
            :onHandleTogglePopupFilter="storeCategoryMain.handleTogglePopupFilter"
          />
          <PopupProductFilterMobile 
            :categoryName="detail.categoryName" 
            :variantGroups="storeVariant.getListVariantGroup"
            :hasFilter="storeCategoryMain.hasFilter"
            :listCategory="storeCategoryMain.getListCategoryChildren"
            :onResetFilter="storeCategoryMain.resetFilter"
            :isTogglePopupFilter="storeCategoryMain.isTogglePopupFilter"
            :onHandleTogglePopupFilter="storeCategoryMain.handleTogglePopupFilter"

            :price-ranges="storeCategoryMain.PRICE_RANGES"
            :selected-price-ranges="storeCategoryMain.selectedPriceRanges"
            :on-toggle-price="storeCategoryMain.togglePriceRange"
            
            :selected-variants="storeCategoryMain.selectedVariants"
            :on-toggle-variant="storeCategoryMain.toggleVariant"
          />
        </div>
        <div v-if="storeCategoryMain.getListCategoryChildren.length > 0" class="mt-ms">
          <ProductChildByCategory :list="storeCategoryMain.getListCategoryChildren" />
        </div>
      </slot>
    </Breadcrumb>

    <div class="container container-xxl" >
      <div :class="[{ 'flex gap-md align-start': storeDisplay.isLaptop }]">
        <client-only>
        <ProductFilterPC 
          v-if="storeDisplay.isLaptop"
          :categoryName="detail.categoryName" 
          :variantGroups="storeVariant.getListVariantGroup"
          :hasFilter="storeCategoryMain.hasFilter"
          :listCategory="storeCategoryMain.getListCategoryChildren"
          :onResetFilter="storeCategoryMain.resetFilter"

          :price-ranges="storeCategoryMain.PRICE_RANGES"
          :selected-price-ranges="storeCategoryMain.selectedPriceRanges"
          :on-toggle-price="storeCategoryMain.togglePriceRange"
          
          :selected-variants="storeCategoryMain.selectedVariants"
          :on-toggle-variant="storeCategoryMain.toggleVariant"
        />
        </client-only>
        <div :class="[{ 'flex-1': storeDisplay.isLaptop }, 'pt-section pb-section']">
          <ProductCategoryMain 
            :description="detail.description"
            :loadingData="storeCategoryMain.loadingData"
            :listData="storeCategoryMain.getListItems"
            :totalPages="storeCategoryMain.getTotalPages"
            v-model:page="storeCategoryMain.page"
            v-model:valueChangePage="storeCategoryMain.valueChangePage"
          />
        </div>
      </div>
    </div>
  </div>

  <div class="pt-section" v-if="detail?.description">
    <div class="bg-gray6">
      <div class="container pt-lg pb-lg">
        <Text color="gray5" :text="detail.description" />
      </div>
    </div>
  </div>

  <SectionProductListSwiper 
    v-if="storeViewed.listItems && storeViewed.listItems.length > 0" 
    :items="storeViewed.listItems" 
    :loading="storeViewed.loading" 
    container="container container-xxl" 
    :headingText="t('product.section.text1')" 
    class="pt-section pb-section"
    fullScreen
  />
  <client-only>
    <PopupManageAddress v-if="storeAccount.getUserId" />
  </client-only>
</template>
