<script lang="ts" setup>
import './index.scss';
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { useBannerStore } from '@/stores/client/banner/useBannerStore';
import { useProductSaleStore } from '@/stores/client/product/useProductSaleStore';
import { useProductMostOrderStore } from '@/stores/client/product/useProductMostOrderStore';
import { usePostLatestStore } from '@/stores/client/news/usePostLatestStore';
import { ROUTES } from '@/shared/constants/routes';
import { useProductCategoryStore } from '@/stores/client/product/useProductCategoryStore';
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';
import { useImageBlockByPage } from '@/composables/image-block/useImageBlockByPage';
import { IMAGE_BLOCK_PAGES, IMAGE_BLOCK_POSITIONS } from '@/shared/constants/image-block';

definePageMeta({
  middleware: ROUTES.PUBLIC.HOME.middleware,
  headerTypeLeft: ROUTES.PUBLIC.HOME.headerTypeLeft,
})

const { t } = useITranslations()

const storeDisplay = useDisplayStore()
const storeBanner = useBannerStore()
const storeProductSale = useProductSaleStore()
const storeProductMostOrder = useProductMostOrderStore()
const storeNewsLatest = usePostLatestStore()
const storeProductCategory = useProductCategoryStore()
const { fetchImageBlock, getByPosition, dataImageBlock } = useImageBlockByPage()

if(storeBanner.getListBanner.length === 0) await storeBanner.fetchBannerStore()
if(!storeProductSale.getListProductSales) await storeProductSale.fetchListProductSales('',Number(storeProductSale.page),storeProductSale.limit,'')
if(!storeProductMostOrder.getListProductMostOrder) await storeProductMostOrder.fetchListProductMostOrder('',Number(storeProductMostOrder.page),storeProductMostOrder.limit,'')
if(storeNewsLatest.getListNewsLatest.length === 0) await storeNewsLatest.fetchPostStore()
if(storeProductCategory.getFlatCategoryList.length === 0) await storeProductCategory.fetchCategoryStore()
if (!dataImageBlock.value[IMAGE_BLOCK_PAGES.HOME]) {
  await fetchImageBlock(IMAGE_BLOCK_PAGES.HOME, {
    [IMAGE_BLOCK_POSITIONS.FEATURED]: 3,
  })
}

const listImageFeatured = getByPosition(
  IMAGE_BLOCK_PAGES.HOME,
  IMAGE_BLOCK_POSITIONS.FEATURED
)

</script>

<template>
  <div :class="storeDisplay.isMobileTable ? 'bg-gray6':''">
    <template v-if="storeDisplay.isMobileTable">
      <client-only>
        <CardAccount showLevel/>
      </client-only>
    </template>
    <div :class="storeDisplay.isMobileTable ? '':'pt-md'">
      <SectionBanner :items="storeBanner.getListBanner" :loading="storeBanner.loading" />
    </div>

    <div :class="[storeDisplay.isLaptop ? 'container container-xxl pl-0 pr-0 pb-section':'', 'pt-section pb-sm']">
      <ProductCategoryAll 
        :items="storeProductCategory.getFlatCategoryList" 
        :loading="storeProductCategory.loading" 
      />
    </div>

    <div v-if="listImageFeatured && listImageFeatured.length > 0" class="container container-xxl pb-section">
      <ImageBlockLayoutColumn :length="listImageFeatured.length">
        <ImageBlock
          v-for="item in listImageFeatured"
          :key="item.id"
          v-bind="item"
        />
      </ImageBlockLayoutColumn>
    </div>

    <div :class="storeDisplay.isMobileTable ? 'home-page-content':''">
      <SectionProductListSwiper 
        v-if="storeProductSale.getListProductSales && storeProductSale.getListProductSales.data.length > 0" 
        :items="storeProductSale.getListProductSales.data" 
        :loading="storeProductSale.loadingData" 
        fullScreen 
        container="container container-xxl" 
        :headingText="t('product.promo.title')"
        class="pb-section"
        :slug="storeProductSale.getTotalItems > storeProductSale.getListProductSales.data?.length ? ROUTES.PUBLIC.PRODUCT.children?.SALE.path: ''"
      />
      <SectionProductListSwiper 
        v-if="storeProductMostOrder.getListProductMostOrder && storeProductMostOrder.getListProductMostOrder.data.length > 0" 
        :items="storeProductMostOrder.getListProductMostOrder.data" 
        :loading="storeProductMostOrder.loadingData" 
        fullScreen 
        container="container container-xxl" 
        :headingText="t('product.list.title1')" 
        :slug="storeProductMostOrder.getTotalItems > storeProductMostOrder.getListProductMostOrder.data?.length ? ROUTES.PUBLIC.PRODUCT.children?.MOST_ORDER.path: ''"
      />

      <client-only>
        <SectionProductList 
          :items="storeProductCategory.getListData" 
          :limitSection="2"
        />
      </client-only>

      <SectionNewsListSwiper 
        :items="storeNewsLatest.getListNewsLatest" 
        :loading="storeNewsLatest.loading"
        pagination
        container="container container-xxl" 
        :headingText="t('news.list.title1')" 
        class="pt-section pb-section" 
      />
    </div>
  </div>
  <client-only><Footer /></client-only>
</template>
