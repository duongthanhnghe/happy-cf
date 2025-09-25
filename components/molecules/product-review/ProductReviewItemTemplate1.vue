<script lang="ts" setup>
import '@/styles/molecules/order/order-item-template1.scss'
import {
  formatCurrency, formatDateTime
} from '@/utils/global'
import type { ProductReviewWithProductDTO } from '@/server/types/dto/product-review.dto';
import { useProductReviewByUserStore } from '@/stores/client/product-review/useProductReviewByUserStore';
import { PRODUCT_REVIEW_STATUS } from '@/shared/constants/product-review-status'

const store = useProductReviewByUserStore();
const props = defineProps<{
  item: ProductReviewWithProductDTO
}>()

</script>
<template>
  <div class="cursor-pointer card card-sm bg-white" v-if="props.item?.status === PRODUCT_REVIEW_STATUS.pending.status"
    @click="store.handleTogglePopupSubmit(true, props.item?.id)"
  >
    <div class="flex justify-between line-height1">
      <div class="flex gap-xs align-center weight-semibold">
        <Button size="xs" color="secondary" icon="package_2" :disable="true"/>
        {{ props.item?.id }}
      </div>
      <div class="flex gap-xs align-center text-color-gray5 text-size-xs">
        <Button size="xs" color="secondary" icon="schedule" :disable="true"/>
        {{ formatDateTime(props.item?.createdAt, 'vi-VN',false) }}
      </div>
    </div>
    <div class="order-template-content flex gap-sm align-center mt-sm mb-sm">
      <div>
        <img class="avatar-src" :src="props.item.productId.image" :alt="props.item.productId.productName" />
      </div>
    </div>
  </div>
  <div v-else class="card card-sm bg-white" >
    <div class="flex justify-between line-height1">
      <v-rating
        readonly
        :model-value="props.item?.rating"
        :size="24"
        active-color="yellow"
      ></v-rating>
      <div class="flex gap-xs align-center text-color-gray5 text-size-xs">
        <Button size="xs" color="secondary" icon="schedule" :disable="true"/>
        {{ formatDateTime(props.item?.createdAt, 'vi-VN',false) }}
      </div>
    </div>
    <div class="order-template-content flex gap-sm align-center mt-sm mb-sm">
      <div>
        <img class="avatar-src" :src="props.item.productId.image" :alt="props.item.productId.productName" />
      </div>
    </div>
  </div>
</template>