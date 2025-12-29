<script lang="ts" setup>
import '@/styles/templates/product/popup-search.scss'
import { useSearchStore } from '@/stores/client/product/useSearchStore'
import { useProductMostOrderStore } from '@/stores/client/product/useProductMostOrderStore';
import { POPUP_HEADER_SEARCH } from '@/shared/constants/breakpoints';
import { useProductViewedStore } from '@/stores/client/product/useProductViewedStore';

const store = useSearchStore()
const storeProductMostOrder = useProductMostOrderStore()
const storeViewed = useProductViewedStore()

</script>

<template>
  <Popup 
    v-model="store.isTogglePopup" 
    align="right" 
    class="popup-search"
    bodyClass="pt-0"
    >
    <template #header >
      <HeaderBoxSearch
        v-model="store.txtSearch"
        @submit="store.onChangeSearch"
        @cancel="store.handleCancelSearch"
      />
    </template>
    <template #body>
      <LoadingData v-if="store.loadingProduct" />
      <template  v-else-if="store.getListProductResult && store.getListProductResult.data.length > 0">
        <v-infinite-scroll
          height="auto"
          mode="manual"
          @load="store.load"
        >
          <div class="mb-sm">
            <template v-for="(item, index) in store.getListProductResult.data" :key="index">
              <div class="mt-sm">
                <ProductItemTemplate1 :product="item" :listView="true"/>
              </div>
            </template>
          </div>
          <template #load-more="{ props }" />
        </v-infinite-scroll>
        <div class="text-center" v-if="store.txtSearch">
          <Button @click="store.handleViewAll()" color="black" label="Xem tất cả"/>
        </div>
      </template>
      <NoData v-else-if="store.getListProductResult && store.getListProductResult.data.length === 0" class="mt-sm" text="Không có kết quả phù hợp" />
      <template v-else></template>

      <div v-if="store.getListSearchKeyword && store.getListSearchKeyword.length > 0 && (!store.getListProductResult || store.getListProductResult.data.length === 0)" class="flex flex-wrap gap-xs mt-sm">
        <div v-for="(item, index) in store.getListSearchKeyword" :key="index">
          <Button size="sm" color="gray" :border="false" class="weight-normal" :label="item.keyword" @click="store.handleLabelSearchItem(item.keyword)"/>
        </div>
      </div>

      <div v-if="storeProductMostOrder.getListProductMostOrder && storeProductMostOrder.getListProductMostOrder.data.length > 0" class="mt-md pb-mt">
        <SectionProductListSwiper :items="storeProductMostOrder.getListProductMostOrder.data" :loading="storeProductMostOrder.loadingData" :breakpoints="POPUP_HEADER_SEARCH" headingText="Gợi ý cho bạn" headingSize="lg" />
      </div>

      <SectionProductListSwiper 
        v-if="storeViewed.listItems && storeViewed.listItems.length > 0" 
        :items="storeViewed.listItems" 
        :loading="storeViewed.loading"
        :breakpoints="POPUP_HEADER_SEARCH"
        headingText="Bạn đã xem"
        headingSize="lg"
        class="pt-md"
      />

    </template>
  </Popup>
</template>