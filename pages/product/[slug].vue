<script lang="ts" setup>
import './index.scss';
import { ROUTES } from '@/shared/constants/routes'
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore'
import { useProductSaleStore } from '@/stores/client/product/useProductSaleStore';
import { useProductViewedStore } from '@/stores/client/product/useProductViewedStore';
import { computed, onMounted, watch } from 'vue';
import { ROUTE_HELPERS } from '@/shared/constants/routes-helpers';
import { useBreadcrumb } from '@/composables/utils/useBreadcrumb';
import { useRoute } from 'vue-router'
import { useProductDetail } from '@/composables/product/useProductDetail';
import { useAccountStore } from "@/stores/client/users/useAccountStore";
import { useProductSEO } from '@/composables/seo/useProductSEO'
import { useAvailableVouchersForOrder } from '@/composables/voucher/useAvailableVouchers';
import { useProductRelated } from '@/composables/product/useProductRelated';
import { useProductReviewByProduct } from '@/composables/product-review/useProductReviewByProduct';
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';
import { useAvailablePromotionGifts } from '@/composables/promotion-gift/useAvailablePromotionGifts';
import { useTopPriority } from '@/composables/product/flash-sale/useTopPriority';
import { useTopFlashSaleProducts } from '@/composables/product/flash-sale/useTopFlashSaleProducts';

definePageMeta({
  middleware: ROUTES.PUBLIC.PRODUCT.children?.DETAIL.middleware ?? { middleware: ['product-detail'] },
  showMembershipCTA: ROUTES.PUBLIC.PRODUCT.children?.DETAIL.showMembershipCTA,
})

const { t } = useITranslations()
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
const { fetchAvailablePromotionGifts } = useAvailablePromotionGifts()
const { fetchTopPriority, getTopPriority } = useTopPriority()
const { fetchTopFlashSaleProducts, getTopFlashSaleProducts, loadingData } = useTopFlashSaleProducts()

const { data, error, pending } = await useAsyncData(
  `product-detail-${slug}`,
  async () => {
    const data = await fetchDetailProduct(slug)
    if(data?.data.id) {
      const routePath = ROUTES.PUBLIC.PRODUCT.children?.DETAIL?.path ?? '/product'
      setProductSEO(data.data, routePath)
    }

    return data
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

onMounted(async () => {
  const detail = store.getDetailProduct
  if (!detail?.id) return

  const userId = storeAccount.getUserId || ''
  const categoryIds = detail.categoryId ? [detail.categoryId] : []
  const orderTotal = store.variantPrice

  if (categoryIds.length && orderTotal) {
    fetchAvailableVouchers({
      userId,
      categoryIds,
      orderTotal
    })

    fetchAvailablePromotionGifts({
      productIds: [detail.id],
      categoryIds: categoryIds,
      orderTotal: orderTotal,
    })
  }

  await fetchTopFlashSaleProducts(detail.categoryId)
  if (getTopFlashSaleProducts.value.length > 0) await fetchTopPriority()

  fetchProductRelated(slug, store.limitRelated)

  fetchListReview(detail.id, 1, store.limitReview)

  if (!storeProductSale.getListProductSales) {
    storeProductSale.fetchListProductSales('',Number(storeProductSale.page),storeProductSale.limit,'')
  }
})
</script>

<template>
  <SkeletonProductDetail v-if="pending" />
  <template v-else-if="detail">
    <div class="container">
      <BreadcrumbDefault v-if="breadcrumbItems.length" :items="breadcrumbItems" />
    </div>
    <div class="pb-section">
      <ProductDetail />
      <client-only>
      <div 
        v-if="getTopFlashSaleProducts.length > 0 && getTopPriority" 
        :class="['container container-xxl pt-section', store.getListProductRelated.length === 0 ? 'pb-section':'']">
        <ProductWithFlashSale 
          :flashSaleInfo="getTopPriority" 
          :listProduct="getTopFlashSaleProducts"
          :loading="loadingData"
          linkMoreToMain
        />
      </div>
      <SectionProductListSwiper 
        v-if="store.getListProductRelated.length > 0" 
        :items="store.getListProductRelated" 
        :loading="store.loadingListRelated" 
        container="container container-xxl" 
        :headingText="t('product.section.text3')" 
        class="pt-section pb-section"
        fullScreen
      />
      <ListReviewByProduct />
      <SectionProductListSwiper 
        v-if="storeProductSale.getListProductSales && storeProductSale.getListProductSales.data.length > 0" 
        :items="storeProductSale.getListProductSales.data" 
        :loading="storeProductSale.loadingData" 
        container="container container-xxl" 
        :headingText="t('product.promo.title')" 
        class="pt-section"
        fullScreen
        :slug="storeProductSale.getTotalItems > storeProductSale.getListProductSales.data?.length ? ROUTES.PUBLIC.PRODUCT.children?.SALE.path: ''"
      />
      <SectionProductListSwiper 
        v-if="storeViewed.listItems && storeViewed.listItems.length > 0" 
        :items="storeViewed.listItems" 
        :loading="storeViewed.loading" 
        container="container container-xxl" 
        :headingText="t('product.section.text1')" 
        class="pt-section"
        fullScreen
      />
      </client-only>
    </div>
  </template>
  <NoData v-else />

  <PopupProductTopFlashSale />
</template>