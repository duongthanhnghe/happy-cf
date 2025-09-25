<script lang="ts" setup>
import { useProductReviewByUserStore } from '@/stores/client/product-review/useProductReviewByUserStore';
import { PRODUCT_REVIEW_STATUS } from '@/shared/constants/product-review-status'

const store = useProductReviewByUserStore();

</script>
<template>
  <Popup popupId="popup-list-review-by-user" v-model="store.isTogglePopup" popupHeading="Danh gia" align="right" bodyClass="bg-gray2 pd-0 pb-md">
    <template #body>
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
      <div class="container pt-ms">
        <v-infinite-scroll
          v-if="store.getItems && store.getItems.length > 0"
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
        <div v-else>
          <NoData />
        </div>
      </div>
    </template>
  </Popup>

  <PopupProductReviewSubmit />
</template>

