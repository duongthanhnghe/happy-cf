<script lang="ts" setup>
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { useBannerStore } from '@/stores/client/banner/useBannerStore';
import { useProductSaleStore } from '@/stores/client/product/useProductSaleStore';
import { useProductMostOrderStore } from '@/stores/client/product/useProductMostOrderStore';
import { usePostLatestStore } from '@/stores/client/news/usePostLatestStore';
import { ROUTES } from '@/shared/constants/routes';

definePageMeta({
  headerTypeLeft: ROUTES.PUBLIC.HOME.headerTypeLeft,
})

const storeDisplay = useDisplayStore()
const storeBanner = useBannerStore()
const storeProductSale = useProductSaleStore()
const storeProductMostOrder = useProductMostOrderStore()
const storeNewsLatest = usePostLatestStore()

const breakpoints = {
  320: { slidesPerView: 2.3, spaceBetween: 10 },
  640: { slidesPerView: 3, spaceBetween: 10 },
  1024: { slidesPerView: 3, spaceBetween: 10 },
  1200: { slidesPerView: 4, spaceBetween: 24 }
}

await storeBanner.fetchBannerStore()
await storeProductSale.fetchProductStore()
await storeProductMostOrder.fetchProductStore()
await storeNewsLatest.fetchPostStore()

</script>

<template>
  <SectionAccount :showBarcode="true"/>
  <SectionBanner :items="storeBanner.getListData" :loading="storeBanner.loading" />

  <div class="pt-section pb-section">
    <div :class="['container', storeDisplay.isMobileTable ? 'pr-0' : '']">
      <SectionProductSales :items="storeProductSale.getListData" :breakpoints="breakpoints" :loading="storeProductSale.loading" headingText="Khuyến mãi" :viewMore="true" />
    </div>
  </div>

  <div class="pb-section">
    <div :class="['container', storeDisplay.isMobileTable ? 'pr-0' : '']">
      <SectionProductMostOrder :items="storeProductMostOrder.getListData" :breakpoints="breakpoints" :loading="storeProductMostOrder.loading" headingText="Gợi ý cho bạn" :viewMore="true" />
    </div>
  </div>

  <div class="pb-section">
    <SectionNewsLatest :items="storeNewsLatest.getListData" :loading="storeNewsLatest.loading" headingText="Tin mới nhất" />
  </div>

  <client-only><Footer /></client-only>
</template>
