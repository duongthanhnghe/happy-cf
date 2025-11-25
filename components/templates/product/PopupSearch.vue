<script lang="ts" setup>
import '@/styles/templates/product/popup-search.scss'
import { globalText } from '@/const/text.js';
import { useSearchStore } from '@/stores/client/product/useSearchStore'
import { useProductMostOrderStore } from '@/stores/client/product/useProductMostOrderStore';
import { POPUP_HEADER_SEARCH } from '@/shared/constants/breakpoints';

const store = useSearchStore()
const storeProductMostOrder = useProductMostOrderStore()

</script>

<template>
  <Popup 
    v-model="store.isTogglePopup" 
    align="right" 
    class="popup-search"
    bodyClass="pt-0"
    >
    <template #header >
      <div class="position-relative flex-1">
        <v-text-field
          v-model="store.txtSearch"
          :label="globalText.search + '...'"
          variant="outlined"
          prepend-inner-icon="mdi-magnify"
          @keydown.enter="store.onChangeSearch"
          hide-details
          required>
        </v-text-field>
        <MaterialIcon v-if="store.txtSearch !== ''" @click="store.handleCancelSearch" name="cancel" size="24" class="popup-search-cancel" />
      </div>
    </template>
    <template #body>
      <LoadingData v-if="store.loadingProduct" />
      <v-infinite-scroll
        v-else-if="store.getListProductResult && store.getListProductResult.length > 0"
        height="auto"
        mode="manual"
        @load="store.load"
      >
        <div class="mb-sm">
          <template v-for="(item, index) in store.getListProductResult" :key="index">
            <div class="mt-sm">
              <ProductItemTemplate1 :product="item" :listView="true"/>
            </div>
          </template>
        </div>
        <template #load-more="{ props }">
          <Button color="secondary" label="Tải thêm" @click="props.onClick" />
        </template>
      </v-infinite-scroll>
      <NoData v-else-if="store.getListProductResult && store.getListProductResult.length === 0" class="mt-sm" text="Khong co ket qua phu hop" />
      <template v-else></template>

      <div v-if="store.getListSearchKeyword && store.getListSearchKeyword.length > 0 && (!store.getListProductResult || store.getListProductResult.length === 0)" class="flex flex-wrap gap-xs mt-sm">
        <div v-for="(item, index) in store.getListSearchKeyword" :key="index">
          <Button size="sm" color="gray" :border="false" class="weight-normal" :label="item.keyword" @click="store.handleLabelSearchItem(item.keyword)"/>
        </div>
      </div>

      <div v-if="storeProductMostOrder.getListProductMostOrder.length > 0" class="mt-md">
        <SectionProductListSwiper :items="storeProductMostOrder.getListProductMostOrder" :loading="storeProductMostOrder.loading" :breakpoints="POPUP_HEADER_SEARCH" headingText="Gợi ý cho ban" />
      </div>

    </template>
  </Popup>
</template>