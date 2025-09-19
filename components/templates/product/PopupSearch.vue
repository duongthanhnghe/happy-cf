<script lang="ts" setup>
import '@/styles/templates/product/popup-search.scss'
import { globalText } from '@/const/text.js';
import { useSearchStore } from '@/stores/client/product/useSearchStore'
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { useProductMostOrderStore } from '@/stores/client/product/useProductMostOrderStore';

const store = useSearchStore()
const storeDisplay = useDisplayStore()
const storeProductMostOrder = useProductMostOrderStore()

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
            required>
          </v-text-field>
          <MaterialIcon v-if="store.txtSearch !== ''" @click="store.handleCancelSearch" name="cancel" size="24" class="popup-search-input-cancel  " />
        </div>
      </div>

      <div v-if="store.getItems && store.getItems.length === 0" class="text-center mt-md">Khong co ket qua phu hop</div>
      
      <v-infinite-scroll
        v-if="store.getItems && store.getItems.length > 0"
        height="auto"
        mode="manual"
        @load="store.load"
      >
        <div class="container mb-sm">
          <template v-for="(item, index) in store.getItems" :key="item">
            <div class="mt-sm">
              <ProductItemTemplate1 :product="item" :listView="true"/>
            </div>
          </template>
        </div>
        <template #load-more="{ props }">
          <Button color="secondary" label="Tải thêm" @click="props.onClick" />
        </template>
      </v-infinite-scroll>

      <div v-else>
        <div v-if="store.getSearchKeyword && store.getSearchKeyword.length > 0" class="flex flex-wrap gap-xs container mt-sm">
          <div v-for="(item, index) in store.getSearchKeyword" :key="index">
            <Button size="sm" color="gray" :border="false" class="weight-normal" :label="item.keyword" @click="store.handleLabelSearchItem(item.keyword)"/>
          </div>
        </div>
      </div>

      <div :class="`mt-md container ${storeDisplay.isMobileTable ? 'pr-0':''}`">
        <SectionProductMostOrder :items="storeProductMostOrder.getListData" :loading="storeProductMostOrder.loading" headingText="Goi y cho ban"/>
      </div>
    </template>
  </Popup>
</template>
