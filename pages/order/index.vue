<script lang="ts" setup>
import './index.scss';
import { ROUTES } from '@/shared/constants/routes';
import { useProductSaleStore } from '@/stores/client/product/useProductSaleStore';
import { useProductMostOrderStore } from '@/stores/client/product/useProductMostOrderStore';
import { useProductCategoryStore } from '@/stores/client/product/useProductCategoryStore'
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { useOrderMainHandlers } from '@/composables/order/useOrderMainHandlers';
import { COLUMN } from '@/shared/constants/column';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import { watch } from 'vue';
import { useRoute } from 'vue-router';
import { useImageBlockByPage } from '@/composables/image-block/useImageBlockByPage';
import { IMAGE_BLOCK_PAGES, IMAGE_BLOCK_POSITIONS } from '@/shared/constants/image-block';

definePageMeta({
  middleware: ROUTES.PUBLIC.ORDER.middleware,
  headerTypeLeft: ROUTES.PUBLIC.ORDER.headerTypeLeft,
})

const route = useRoute()
const storeProductSale = useProductSaleStore()
const storeProductMostOrder = useProductMostOrderStore()
const storeProductCategory = useProductCategoryStore()
const storeAccount = useAccountStore();
const storeDisplay = useDisplayStore();
const { fetchImageBlock, getByPosition, dataImageBlock } = useImageBlockByPage()

const { tab, tabs } = await useOrderMainHandlers(storeProductMostOrder,storeProductSale, storeProductCategory)

if (route.query.tab) tab.value = Number(route.query.tab)

watch(() => route.query.tab, (newVal) => {
  if (newVal) tab.value = Number(newVal)
})

if (!dataImageBlock.value[IMAGE_BLOCK_PAGES.PRODUCT_SALE] || !dataImageBlock.value[IMAGE_BLOCK_PAGES.PRODUCT_SELLER]) {
  await Promise.all([
    fetchImageBlock(IMAGE_BLOCK_PAGES.PRODUCT_SALE, {
      [IMAGE_BLOCK_POSITIONS.HERO]: 1,
    }),
    fetchImageBlock(IMAGE_BLOCK_PAGES.PRODUCT_SELLER, {
      [IMAGE_BLOCK_POSITIONS.HERO]: 1,
    }),
  ])
}

const bannerSale = getByPosition(
  IMAGE_BLOCK_PAGES.PRODUCT_SALE,
  IMAGE_BLOCK_POSITIONS.HERO
)

const bannerSeller = getByPosition(
  IMAGE_BLOCK_PAGES.PRODUCT_SELLER,
  IMAGE_BLOCK_POSITIONS.HERO
)

</script>

<template>
  <div :class="[{ '_hidden': storeDisplay.isLaptop },'bg-white shadow-2']">
    <v-tabs v-model="tab" align-tabs="center">
      <v-tab
          v-for="item in tabs"
          :key="item.value"
          :value="item.value"
          class="flex-1 text-color-gray5"
        >
          <div class="flex gap-xs">
            <MaterialIcon :name="item.icon" class="text-color-primary" />
            {{ item.label }}
          </div>
        </v-tab>
    </v-tabs>
  </div>
  <div class="order-main-content">
    <v-tabs-window v-model="tab">
      <v-tabs-window-item :value="1">
        <div class="flex align-start bg-gray6">
          <div class="order-main-content-scroll scroll-hide bg-white">
            <ProductCategoryMenu :items="storeProductCategory.getListData" :loading="storeProductCategory.loading" />
          </div>
          <div class="order-main-content-scroll scroll-hide flex-1">
            <div class="product-category-section">
              <SectionProductList :items="storeProductCategory.getListData" bgTab="bg-gray6" :variantTemplateProduct="storeDisplay.isLaptop ? 'card':''" />
            </div>
          </div>
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item :value="2">
        <div 
          v-if="storeProductMostOrder.getListProductMostOrder && storeProductMostOrder.getListProductMostOrder.data.length > 0"
          class="pt-lg order-main-content-scroll scroll-hide"
          >
          <div class="container container-xxl">
            <div v-if="bannerSeller[0]" class="pb-lg">
              <ImageBlock v-bind="bannerSeller[0]" :showContent="false" />
            </div>
            <SectionProductListColumn
              :items="storeProductMostOrder.getListProductMostOrder.data"
              :loading="storeProductMostOrder.loadingData" 
              :column="COLUMN.PRODUCT_XL"
              headingText="Top bán chay"
              showNoData
            />
            <div class="text-center pb-lg" v-if="storeProductMostOrder.getTotalItems > storeProductMostOrder.getListProductMostOrder.data?.length">
              <NuxtLink
                :to="{ path: ROUTES.PUBLIC.PRODUCT.children?.MOST_ORDER.path }"
              >
                <Button color="black" label="Xem tất cả"/>
              </NuxtLink>
            </div>
          </div>
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item :value="3">
        <div 
          v-if="storeProductSale.getListProductSales && storeProductSale.getListProductSales.data.length > 0"
          class="pt-lg order-main-content-scroll scroll-hide"
          >
          <div class="container container-xxl">
            <div v-if="bannerSale[0]" class="pb-lg">
              <ImageBlock v-bind="bannerSale[0]" :showContent="false" />
            </div>
            <SectionProductListColumn
              :items="storeProductSale.getListProductSales.data"
              :loading="storeProductSale.loadingData" 
              :column="COLUMN.PRODUCT_XL"
              headingText="Top khuyến mãi"
              showNoData
            />
            <div class="text-center pb-lg" v-if="storeProductSale.getTotalItems > storeProductSale.getListProductSales.data?.length">
              <NuxtLink
                :to="{ path: ROUTES.PUBLIC.PRODUCT.children?.SALE.path }"
              >
                <Button color="black" label="Xem tất cả"/>
              </NuxtLink>
            </div>
          </div>
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>

  <client-only>
    <PopupManageAddress v-if="storeAccount.getUserId" />
  </client-only>
</template>