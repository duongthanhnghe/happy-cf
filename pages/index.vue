<script lang="ts" setup>
import './index.scss';
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { useBannerStore } from '@/stores/client/banner/useBannerStore';
import { useProductSaleStore } from '@/stores/client/product/useProductSaleStore';
import { useProductMostOrderStore } from '@/stores/client/product/useProductMostOrderStore';
import { usePostLatestStore } from '@/stores/client/news/usePostLatestStore';
import { ROUTES } from '@/shared/constants/routes';
import { useProductCategoryStore } from '@/stores/client/product/useProductCategoryStore';

definePageMeta({
  middleware: ROUTES.PUBLIC.HOME.middleware,
  headerTypeLeft: ROUTES.PUBLIC.HOME.headerTypeLeft,
})

const storeDisplay = useDisplayStore()
const storeBanner = useBannerStore()
const storeProductSale = useProductSaleStore()
const storeProductMostOrder = useProductMostOrderStore()
const storeNewsLatest = usePostLatestStore()
const storeProductCategory = useProductCategoryStore()

if(storeBanner.getListBanner.length === 0) await storeBanner.fetchBannerStore()
if(storeProductSale.getListProductSales.length === 0) await storeProductSale.fetchProductStore()
if(storeProductMostOrder.getListProductMostOrder.length === 0) await storeProductMostOrder.fetchProductStore()
if(storeNewsLatest.getListNewsLatest.length === 0) await storeNewsLatest.fetchPostStore()
if(storeProductCategory.getFlatCategoryList.length === 0) await storeProductCategory.fetchCategoryStore()

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
        heading="Danh mục" 
        :items="storeProductCategory.getFlatCategoryList" 
        :loading="storeProductCategory.loading" 
      />
    </div>

    <div :class="[storeDisplay.isMobileTable ? 'pb-section':'' ,'container container-xxl']" >
      <div :class="[storeDisplay.isMobileTable ? 'flex-direction-column gap-ms':'flex-direction-row gap-md' ,'flex']">
        <BoxImage 
          image="https://res.cloudinary.com/dl8wwezqp/image/upload/v1764155287/BANNER/slide_3_img.jpg"
          heading="Khuyến mãi"
          textBtn="Khám phá"
          linkHref="/order?tab=3"
        />
        <BoxImage 
          image="https://res.cloudinary.com/dl8wwezqp/image/upload/v1764155405/BANNER/slide_1_img.jpg"
          heading="Bán chạy"
          textBtn="Khám phá"
          linkHref="/order?tab=2"
        />
      </div>
    </div>

    <div :class="storeDisplay.isMobileTable ? 'home-page-content':''">
      <SectionProductListSwiper 
        v-if="storeProductSale.getListProductSales.length > 0" 
        :items="storeProductSale.getListProductSales" 
        :loading="storeProductSale.loading" 
        fullScreen 
        container="container container-xxl" 
        headingText="Khuyến mãi" 
        class="pt-section pb-section"
      />
      <SectionProductListSwiper 
        v-if="storeProductMostOrder.getListProductMostOrder.length > 0" 
        :items="storeProductMostOrder.getListProductMostOrder" 
        :loading="storeProductMostOrder.loading" 
        fullScreen 
        container="container container-xxl" 
        headingText="Gợi ý cho bạn" 
        class="pb-section"
      />
      <SectionNewsListSwiper 
        :items="storeNewsLatest.getListNewsLatest" 
        :loading="storeNewsLatest.loading" 
        pagination
        container="container container-xxl" 
        headingText="Tin mới nhất" 
        class="pb-section" 
      />
    </div>
  </div>
  <client-only><Footer /></client-only>
</template>
