<script lang="ts" setup>
import type { ProductDTO } from '@/server/types/dto/v1/product.dto';

const props = defineProps<{
  detail: ProductDTO
}>()
</script>

<template>
  <div class="w-full">
    <Image 
      v-if="detail.vouchers?.image"
      :src="detail.vouchers?.image" 
      :alt="detail.productName"
      :width="700"
    />
    <Image 
      v-if="detail.flashSale?.badgeImage && !detail.vouchers?.image"
      :src="detail.flashSale?.badgeImage" 
      :alt="detail.productName"
      :width="700"
    />
  </div>
</template>