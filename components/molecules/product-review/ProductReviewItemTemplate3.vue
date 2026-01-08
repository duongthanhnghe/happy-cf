<script lang="ts" setup>
import { formatDateTime } from '@/utils/global'
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import type { ProductReviewWithProductDTO } from '@/server/types/dto/v1/product-review.dto';

const storeAccount = useAccountStore();
const storeDisplay = useDisplayStore()
const props = defineProps<{
  item: ProductReviewWithProductDTO
}>()

</script>
<template>
  <Card size="sm" :bg="storeDisplay.isLaptop ? 'gray6':'white'" class="rd-lg shadow-1">
    <div class="flex justify-between line-height-1">
      <Text :text="storeAccount.getDetailValue?.fullname" weight="semibold" size="normal" color="black" />
      <Text :text="formatDateTime(props.item?.createdAt, 'vi-VN',false)" color="gray5" />
    </div>

    <div class="mt-sm" style="margin-left: -4px;">
      <v-rating
        readonly
        :model-value="props.item?.rating"
        :size="22"
        active-color="orange"
      ></v-rating>
    </div>

    <div :class="['flex gap-xs align-center mt-md mb-md rd-lg', storeDisplay.isLaptop ? 'bg-white':'bg-gray6']">
      <div class="pd-xs">
        <Image 
          class="rd-lg" :src="props.item.productId.image" :alt="props.item.productId.productName" :width="40"
        />
      </div>
      <Text :text="props.item.productId.productName" limit="2" />
    </div>

    <Text :text="props.item?.comment" color="gray5" />
  </Card>
</template>