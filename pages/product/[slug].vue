<script lang="ts" setup>
import './index.scss';
import { ROUTES } from '@/shared/constants/routes'
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore'
import { useProductSaleStore } from '@/stores/client/product/useProductSaleStore';
import { useProductViewedStore } from '@/stores/client/product/useProductViewedStore';
import { computed, watch } from 'vue';
import { ROUTE_HELPERS } from '@/shared/constants/routes-helpers';
import { useBreadcrumb } from '@/composables/utils/useBreadcrumb';
import { useRoute } from 'vue-router'
import { useProductDetail } from '@/composables/product/useProductDetail';
import { useAccountStore } from "@/stores/client/users/useAccountStore";
import { useProductSEO } from '@/composables/seo/useProductSEO'
import { useAvailableVouchersForOrder } from '@/composables/voucher/useAvailableVouchers';
import { useProductRelated } from '@/composables/product/useProductRelated';
import { useProductReviewByProduct } from '@/composables/product-review/useProductReviewByProduct';

definePageMeta({
  middleware: ROUTES.PUBLIC.PRODUCT.children?.DETAIL.middleware ?? { middleware: ['product-detail'] },
})

const store = useProductDetailStore()
const storeProductSale = useProductSaleStore()
const storeViewed = useProductViewedStore()
const storeAccount = useAccountStore()

const route = useRoute()
const slug = route.params.slug as string

const { getDetailProduct, fetchDetailProduct } = useProductDetail()
const { setProductSEO } = useProductSEO()
const { fetchAvailableVouchers } = useAvailableVouchersForOrder();
const { fetchProductRelated } = useProductRelated()
const { fetchListReview } = useProductReviewByProduct()

const { data, error, pending } = await useAsyncData(
  `product-detail-${slug}`,
  async () => {
    const data = await fetchDetailProduct(slug)
    if(data?.data.id) {
      const userId = storeAccount.getUserId || '';
      const categoryIds = data?.data.categoryId ? [data?.data.categoryId] : [];
      const orderTotal = data?.data.priceDiscounts;
      const routePath = ROUTES.PUBLIC.PRODUCT.children?.DETAIL?.path ?? '/product'

      setProductSEO(data.data, routePath)

      if(categoryIds && orderTotal){
        await fetchAvailableVouchers({
          userId,
          categoryIds,
          orderTotal
        })
      }

      await fetchProductRelated(slug, store.limitRelated)

      await fetchListReview(data.data.id, 1, store.limitReview)

      if(!storeProductSale.getListProductSales) await storeProductSale.fetchListProductSales('',Number(storeProductSale.page),storeProductSale.limit,'')
      
    }
  }
)

const detail = getDetailProduct

watch(
  () => store.getDetailProduct?.id,
  async (id, oldId) => {
    if (!id || id === oldId) return

    storeViewed.addViewedProduct(id)

    await storeViewed.fetchViewedProducts(storeViewed.limit)
  },
  { immediate: true }
)

const breadcrumbItems = useBreadcrumb({
  parents: computed(() =>
    (store.getDetailProduct?.categoryBreadcrumb ?? []).map(cat => ({
      label: cat.label,
      path: ROUTE_HELPERS.productCategory(cat.slug),
    }))
  ),
  current: computed(() => ({
    label: store.getDetailProduct?.productName || '',
  })),
})

</script>

<template>
  <LoadingData v-if="pending" />
  <template v-else-if="detail">
    <div class="container">
      <BreadcrumbDefault v-if="breadcrumbItems.length" :items="breadcrumbItems" />
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
        :loading="storeProductSale.loadingData" 
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