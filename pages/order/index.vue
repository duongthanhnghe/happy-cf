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
definePageMeta({
  middleware: ROUTES.PUBLIC.ORDER.middleware,
  headerTypeLeft: ROUTES.PUBLIC.ORDER.headerTypeLeft,
})

const storeProductSale = useProductSaleStore()
const storeProductMostOrder = useProductMostOrderStore()
const storeProductCategory = useProductCategoryStore()
const storeAccount = useAccountStore();
const storeDisplay = useDisplayStore();

const { tab, tabs } = await useOrderMainHandlers(storeProductMostOrder,storeProductSale, storeProductCategory)

</script>

<template>
  <div class="bg-white shadow-2">
    <v-tabs v-model="tab" align-tabs="center" :class="{ container: storeDisplay.isLaptop }">
      <v-tab
          v-for="item in tabs"
          :key="item.value"
          :value="item.value"
          class="flex-1 text-color-gray5"
        >
          <div class="flex flex-direction-column">
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
            <SectionProductList :items="storeProductCategory.getListData" :loading="storeProductCategory.loading"/>
          </div>
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item :value="2">
        <div class="container container-xxl pt-section order-main-content-scroll scroll-hide">
          <SectionProductMostOrder
            :items="storeProductMostOrder.getListProductMostOrder"
            :loading="storeProductMostOrder.loading" 
            :runSlide="false" 
            background="bg-white"
            :column="COLUMN.PRODUCT_XL"
            headingText="Top ban chay"
          />
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item :value="3">
        <div class="container container-xxl pt-section order-main-content-scroll scroll-hide">
          <SectionProductSales
            :items="storeProductSale.getListProductSales"
            :loading="storeProductSale.loading"
            :runSlide="false"
            background="bg-white"
            :column="COLUMN.PRODUCT_XL"
            headingText="Khuyen mai"
          />
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>

  <PopupManageAddress v-if="storeAccount.getDetailValue?.id" />
</template>