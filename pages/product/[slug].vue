<script lang="ts" setup>
import './index.scss';
import { ROUTES } from '@/shared/constants/routes'
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore'
import { useProductSaleStore } from '@/stores/client/product/useProductSaleStore';
import type { ProductDTO } from "@/server/types/dto/v1/product.dto";

definePageMeta({
  middleware: ROUTES.PUBLIC.PRODUCT.children?.DETAIL.middleware ?? { middleware: ['product-detail'] },
})

const store = useProductDetailStore()
const storeProductSale = useProductSaleStore()
const detail: ProductDTO | null = store.getDetailProduct

if(storeProductSale.getListProductSales.length === 0) await storeProductSale.fetchProductStore()

</script>

<template>
  <template v-if="detail">
    <div class="container">
      <BreadcrumbDefault :custom-label="detail.productName || ''" />
    </div>
    <div class="product-detail-body">
      <ProductDetail />
      <SectionProductListSwiper 
        v-if="store.getListProductRelated.length > 0" 
        :items="store.getListProductRelated" 
        :loading="store.loadingListRelated" 
        container="container container-xxl" 
        headingText="Gợi ý liên quan" 
        class="pt-section pb-section"
      />
      <ListReviewByProduct />
      <SectionProductListSwiper 
        v-if="storeProductSale.getListProductSales.length > 0" 
        :items="storeProductSale.getListProductSales" 
        :loading="storeProductSale.loading" 
        container="container container-xxl" 
        headingText="Khuyến mãi" 
        class="pt-section pb-section"
      />
    </div>
  </template>
  <NoData v-else />
</template>