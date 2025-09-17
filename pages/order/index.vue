<script lang="ts" setup>
import './index.scss';
import { ROUTES } from '@/shared/constants/routes';
import { ref, watchEffect } from 'vue'
import { useProductSaleStore } from '@/stores/client/product/useProductSaleStore';
import { useProductMostOrderStore } from '@/stores/client/product/useProductMostOrderStore';
import { useProductCategoryStore } from '@/stores/client/product/useProductCategoryStore'

definePageMeta({
  headerTypeLeft: ROUTES.PUBLIC.ORDER.headerTypeLeft,
})

const tab = ref(null)

const storeProductSale = useProductSaleStore()
const storeProductMostOrder = useProductMostOrderStore()
const storeProductCategory = useProductCategoryStore()

await storeProductCategory.fetchCategoryStore()

watchEffect(() => {
  if (tab.value === 2) storeProductMostOrder.fetchProductStore()
  if (tab.value === 3) storeProductSale.fetchProductStore()
})

</script>

<template>
  <div class="bg-gray2 pb-sm">
    <div class="bg-white">
      <v-tabs v-model="tab" align-tabs="center">
        <v-tab :value="1" class="flex-1 text-color-gray5">
          <div class="flex flex-direction-column">
            <MaterialIcon name="category" class="text-color-primary"/>
            Menu
          </div>
        </v-tab>
        <v-tab :value="2" class="flex-1 text-color-gray5">
          <div class="flex flex-direction-column">
            <MaterialIcon name="local_fire_department" class="text-color-primary"/>
            Top 10
          </div>
        </v-tab>
        <v-tab :value="3" class="flex-1 text-color-gray5">
          <div class="flex flex-direction-column">
            <MaterialIcon name="percent" class="text-color-primary"/>
            Khuyen mai
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
</template>