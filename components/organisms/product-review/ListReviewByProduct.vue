<script lang="ts" setup>
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore';
import { ref, watch } from 'vue';
import { COLUMN } from '@/shared/constants/column';

const store = useProductDetailStore()
const valueChangePage = ref<boolean|null>(null)

watch(valueChangePage, (newVal) => {
  if(newVal !== null) store.handleChangePage(newVal)
  valueChangePage.value = null
})
</script>

<template>
  <div class="bg-gray6 pt-section pb-section">
    <div class="container container-xxl">
      <LoadingData v-if="store.loadingListReviews && store.getListReviewProduct === null" />
      <template v-else>
        <Heading tag="h2" size="lg" weight="semibold" class="black mb-md">
          Đánh giá sản phẩm
        </Heading>

        <div class="flex align-end gap-xs mb-xs">
          <Text :text="store.getSummaryReview?.averageRating" color="black" size="xxl" weight="semibold" class="line-height-1"/>
          <v-rating
            readonly
            :model-value="store.getSummaryReview?.averageRating"
            :size="30"
            active-color="orange"
            class="product-detail-rating-icon"
          >
          </v-rating>
        </div>
        <Text :text="`Dựa trên ${store.getSummaryReview?.totalReviews} đánh giá đến từ khách hàng`" color="gray5" class="mb-ms" />

        <div v-if="store.getListReviewProduct && store.getListReviewProduct?.length > 0" :class="COLUMN.ROW">
        <template v-for="item in store.getListReviewProduct" :key="item.id" >
          <div v-if="store.getListReviewProduct" :class="COLUMN.REVIEW_BY_PRODUCT">
            <ProductReviewItemTemplate2 :item="item" />
          </div>
        </template>
        </div>
        <NoData v-else />

        <div v-if="store.getTotalPages && store.getTotalPages.length > 1" class="flex gap-sm justify-end mt-sm">
          <Pagination :totalPages="store.getTotalPages" v-model:page="store.pageReview" v-model:valueChangePage="valueChangePage" />
        </div>
      </template>
    </div>
  </div>
</template>
