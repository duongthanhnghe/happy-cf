<script lang="ts" setup>
import './index.scss';
import { ROUTES } from '@/shared/constants/routes'
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore'
import { useProductSaleStore } from '@/stores/client/product/useProductSaleStore';
import type { ProductDTO } from "@/server/types/dto/v1/product.dto";
import { useProductViewedStore } from '@/stores/client/product/useProductViewedStore';
import { watch } from 'vue';

definePageMeta({
  middleware: ROUTES.PUBLIC.PRODUCT.children?.DETAIL.middleware ?? { middleware: ['product-detail'] },
})

const store = useProductDetailStore()
const storeProductSale = useProductSaleStore()
const storeViewed = useProductViewedStore()
const detail: ProductDTO | null = store.getDetailProduct

if(!storeProductSale.getListProductSales) await storeProductSale.fetchListProductSales('',storeProductSale.page,storeProductSale.limit,'')

watch(
  () => store.getDetailProduct?.id,
  async (id, oldId) => {
    if (!id || id === oldId) return

    storeViewed.addViewedProduct(id)

    await storeViewed.fetchViewedProducts(storeViewed.limit)
  },
  { immediate: true }
)

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
        v-if="storeProductSale.getListProductSales && storeProductSale.getListProductSales.data.length > 0" 
        :items="storeProductSale.getListProductSales.data" 
        :loading="storeProductSale.loading" 
        container="container container-xxl" 
        headingText="Khuyến mãi" 
        class="pt-section"
        :slug="storeProductSale.getTotalItems > storeProductSale.getListProductSales.data?.length ? ROUTES.PUBLIC.PRODUCT.children?.SALE.path: ''"
      />
      <SectionProductListSwiper 
        v-if="storeViewed.listItems && storeViewed.listItems.length > 0" 
        :items="storeViewed.listItems" 
        :loading="storeViewed.loading" 
        container="container container-xxl" 
        headingText="Bạn đã xem" 
        class="pt-section pb-section"
      />
    </div>
  </template>
  <NoData v-else />
</template>