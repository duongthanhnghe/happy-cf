<script lang="ts" setup>
import { useProductReviewByUserStore } from '@/stores/client/product-review/useProductReviewByUserStore';
import { PRODUCT_REVIEW_STATUS } from '@/shared/constants/product-review-status'

const store = useProductReviewByUserStore();

</script>
<template>
  <v-tabs
    fixed-tabs
    v-model="store.statusFilter"
    class="bg-white sticky"
  >
    <v-tab
      v-for="item in PRODUCT_REVIEW_STATUS"
      :key="item.status"
      :value="item.status"
      :text="item.name"
    />
  </v-tabs>
  <LoadingData v-if="store.loadingData && !store.getItems === null" />
  <div v-else-if="store.getItems && store.getItems.length > 0" class="pt-ms">
    <v-infinite-scroll
      height="auto"
      mode="manual"
      @load="store.load"
    >
      <div v-for="item in store.getItems" :key="item.id" class="mb-sm">
        <ProductReviewItemTemplate1 :item="item"/>
      </div>
      <template #load-more="{ props }">
        <Button color="secondary" label="Tải thêm" @click="props.onClick" />
      </template>
    </v-infinite-scroll>
  </div>
  <NoData v-else />
</template>

