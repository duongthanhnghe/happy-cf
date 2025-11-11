<script lang="ts" setup>
import '@/styles/templates/product/popup-search.scss'
import { globalText } from '@/const/text.js';
import { useSearchStore } from '@/stores/client/product/useSearchStore'
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { useProductMostOrderStore } from '@/stores/client/product/useProductMostOrderStore';

const store = useSearchStore()
const storeDisplay = useDisplayStore()
const storeProductMostOrder = useProductMostOrderStore()
const breakpoints = {
  320: { slidesPerView: 1.3, spaceBetween: 10 },
  640: { slidesPerView: 2, spaceBetween: 10 },
  1024: { slidesPerView: 3, spaceBetween: 10 },
}

</script>

<template>
  <Popup popupId="popup-search" v-model="store.isTogglePopup" align="right" class="popup-search" bodyClass="pd-0">
    <template #body>
      <div class="popup-search-top">
        <div class="popup-search-input">
          <v-text-field
            v-model="store.txtSearch"
            :label="globalText.search + '...'"
            variant="outlined"
            prepend-inner-icon="mdi-magnify"
            @keydown.enter="store.onChangeSearch"
            hide-details
            required>
          </v-text-field>
          <MaterialIcon v-if="store.txtSearch !== ''" @click="store.handleCancelSearch" name="cancel" size="24" class="popup-search-input-cancel  " />
        </div>
      </div>
      
      <LoadingData v-if="store.loadingProduct" />
      <v-infinite-scroll
        v-else-if="store.getListProductResult && store.getListProductResult.length > 0"
        height="auto"
        mode="manual"
        @load="store.load"
      >
        <div class="container mb-sm">
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

      <div v-if="store.getListSearchKeyword && store.getListSearchKeyword.length > 0 && (!store.getListProductResult || store.getListProductResult.length === 0)" class="flex flex-wrap gap-xs container mt-sm">
        <div v-for="(item, index) in store.getListSearchKeyword" :key="index">
          <Button size="sm" color="gray" :border="false" class="weight-normal" :label="item.keyword" @click="store.handleLabelSearchItem(item.keyword)"/>
        </div>
      </div>

      <div :class="`mt-md container ${storeDisplay.isMobileTable ? 'pr-0':''}`">
        <SectionProductMostOrder :items="storeProductMostOrder.getListProductMostOrder" :breakpoints="breakpoints" :loading="storeProductMostOrder.loading" headingText="Goi y cho ban"/>
      </div>
    </template>
  </Popup>
</template>
