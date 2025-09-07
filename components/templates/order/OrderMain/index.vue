<script lang="ts" setup>
import './index.scss';
import { ref } from 'vue'
const tab = ref(null)

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
            <ProductCategoryMenu />
          </div>
          <div class="order-main-content-scroll scroll-hide flex-1">
            <SectionProductList />
          </div>
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item :value="2">
        <div class="container pt-sm order-main-content-scroll scroll-hide">
          <SectionProductMostOrder :runSlide="false" background="bg-white"/>
        </div>
      </v-tabs-window-item>
      <v-tabs-window-item :value="3">
        <div class="container pt-sm order-main-content-scroll scroll-hide">
          <SectionProductSales :runSlide="false" background="bg-white"/>
        </div>
      </v-tabs-window-item>
    </v-tabs-window>
  </div>
</template>