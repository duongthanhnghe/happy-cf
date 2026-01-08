<script lang="ts" setup>
import { formatDateTime } from '@/utils/global'
import { useProductReviewByUserStore } from '@/stores/client/product-review/useProductReviewByUserStore';
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import type { ProductReviewWithProductDTO } from '@/server/types/dto/v1/product-review.dto';

const store = useProductReviewByUserStore();
const storeAccount = useAccountStore();
const storeDisplay = useDisplayStore()
const props = defineProps<{
  item: ProductReviewWithProductDTO
}>()

</script>
<template>
  <Card size="sm" :bg="storeDisplay.isLaptop ? 'gray6':'white'" class="rd-lg shadow-1">
    <div class="flex justify-between line-height-1">
      <div>
        <Text :text="storeAccount.getDetailValue?.fullname" weight="semibold" size="normal" color="black" />
        <Text :text="formatDateTime(props.item?.createdAt, 'vi-VN',false)" class="mt-ms" color="gray5" />
      </div>
      <Button size="sm" color="black" label="Đánh giá" class="weight-normal" @click.prevent="store.handleTogglePopupSubmit(true, props.item?.id)"/>
    </div>
    <div :class="['flex gap-xs align-center mt-md rd-lg', storeDisplay.isLaptop ? 'bg-white':'bg-gray6']">
      <div class="pd-xs">
        <Image 
          class="rd-lg" :src="props.item.productId.image" :alt="props.item.productId.productName" :width="40"
        />
      </div>
      <Text :text="props.item.productId.productName" limit="2" />
    </div>
  </Card>
</template>