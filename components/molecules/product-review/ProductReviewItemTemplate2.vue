<script lang="ts" setup>
import { formatDateTime } from '@/utils/global'
import type { ProductReviewWithProductDTO } from '@/server/types/dto/v1/product-review.dto';

const props = defineProps<{
  item: ProductReviewWithProductDTO
}>()

</script>
<template>
  <Card size="md" class="rd-lg shadow-1">
    <div class="flex justify-between line-height-1">
      <Text :text="props.item?.userId.fullname" weight="semibold" size="normal" color="black" />
      <Text :text="formatDateTime(props.item?.createdAt, 'vi-VN',false)" color="gray5" />
    </div>
    <div class="mt-xs" style="margin-left: -4px;">
      <v-rating
        readonly
        :model-value="props.item?.rating"
        :size="22"
        active-color="orange"
      ></v-rating>
    </div>
    <Text :text="props.item?.comment" color="gray5" class="mt-sm" />
  </Card>
</template>