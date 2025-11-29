<script lang="ts" setup>
import { useProductReviewByUserStore } from '@/stores/client/product-review/useProductReviewByUserStore';
import { PRODUCT_REVIEW_STATUS } from '@/shared/constants/product-review-status'
import { useStickyObserver } from "@/utils/stickyObserver"

const store = useProductReviewByUserStore();
const { isStuck } = useStickyObserver('tabsReview')

</script>
<template>
  <v-tabs
    fixed-tabs
    v-model="store.statusFilter"
    :class="['sticky sticky-cover-header', isStuck ? 'bg-gray6':'bg-white rd-lg shadow-1']"
  >
    <v-tab
      v-for="item in PRODUCT_REVIEW_STATUS"
      :key="item.status"
      :value="item.status"
      :text="item.name"
    />
  </v-tabs>
  <div id="tabsReview" />
  <LoadingData v-if="store.loadingData && !store.getItems" />
  <div v-else-if="store.getItems && store.getItems.length > 0" class="pt-ms">
    <v-infinite-scroll
      height="auto"
      mode="manual"
      @load="store.load"
    >
      <div v-for="item in store.getItems" :key="item.id" class="mb-ms">
        <ProductReviewItemTemplate1 :item="item" v-if="item?.status === PRODUCT_REVIEW_STATUS.pending.status"/>
        <ProductReviewItemTemplate3 :item="item" v-else />
      </div>
      <template #load-more="{ props }">
        <Button color="secondary" label="Xem thêm" @click="props.onClick" />
      </template>
    </v-infinite-scroll>
  </div>
  <NoData v-else />
</template>

