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

const { tab, tabs } = await useOrderMainHandlers(storeProductMostOrder,storeProductSale, storeProductCategory)

if (route.query.tab) tab.value = Number(route.query.tab)

watch(() => route.query.tab, (newVal) => {
  if (newVal) tab.value = Number(newVal)
})

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
        <SectionProductListColumn
          :items="storeProductMostOrder.getListProductMostOrder"
          :loading="storeProductMostOrder.loading" 
          :column="COLUMN.PRODUCT_XL"
          container="container container-xxl"
          class="pt-section order-main-content-scroll scroll-hide"
          headingText="Top ban chay"
        />
      </v-tabs-window-item>
      <v-tabs-window-item :value="3">
        <SectionProductListColumn
          :items="storeProductSale.getListProductSales"
          :loading="storeProductSale.loading" 
          :column="COLUMN.PRODUCT_XL"
          container="container container-xxl"
          class="pt-section order-main-content-scroll scroll-hide"
          headingText="Khuyen mai"
        />
      </v-tabs-window-item>
    </v-tabs-window>
  </div>

  <PopupManageAddress v-if="storeAccount.getUserId" />
</template>