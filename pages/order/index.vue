<script lang="ts" setup>
import './index.scss';
import { ROUTES } from '@/shared/constants/routes';
import { useProductSaleStore } from '@/stores/client/product/useProductSaleStore';
import { useProductMostOrderStore } from '@/stores/client/product/useProductMostOrderStore';
import { useProductCategoryStore } from '@/stores/client/product/useProductCategoryStore'
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { useOrderMainHandlers } from '@/composables/order/useOrderMainHandlers';

definePageMeta({
  middleware: ROUTES.PUBLIC.ORDER.middleware,
  headerTypeLeft: ROUTES.PUBLIC.ORDER.headerTypeLeft,
})

const storeProductSale = useProductSaleStore()
const storeProductMostOrder = useProductMostOrderStore()
const storeProductCategory = useProductCategoryStore()
const storeAccount = useAccountStore();

const { tab, tabs } = await useOrderMainHandlers(storeProductMostOrder,storeProductSale, storeProductCategory)

</script>

<template>
  <div class="bg-gray2 pb-sm">
    <div class="bg-white">
      <v-tabs v-model="tab" align-tabs="center">
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
  </div>
  <div class="order-main-content">
    <v-tabs-window v-model="tab">
      <v-tabs-window-item :value="1">
        <div class="flex align-start bg-gray2">
          <div class="order-main-content-scroll scroll-hide">
            <ProductCategoryMenu :items="storeProductCategory.getListData" :loading="storeProductCategory.loading" />
          </div>
          <div class="order-main-content-scroll scroll-hide flex-1">
            <SectionProductList :items="storeProductCategory.getListData" :loading="storeProductCategory.loading"/>
          </div>
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item :value="2">
        <div class="container pt-sm order-main-content-scroll scroll-hide">
          <SectionProductMostOrder :items="storeProductMostOrder.getListData" :loading="storeProductMostOrder.loading" :runSlide="false" background="bg-white"/>
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item :value="3">
        <div class="container pt-sm order-main-content-scroll scroll-hide">
          <SectionProductSales :items="storeProductSale.getListData" :loading="storeProductSale.loading" :runSlide="false" background="bg-white"/>
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>

  <PopupManageAddress v-if="storeAccount.getDetailValue?.id" />
</template>