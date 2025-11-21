<script lang="ts" setup>
import type { ProductDTO } from '@/server/types/dto/v1/product.dto';

const props = defineProps<{
  detail: ProductDTO
}>()
</script>

<template>
  <div class="product-detail-fixed-mobile shadow-2">
    <ProductDetailOptions v-if="detail.options.length > 0" :options="detail.options" :showHeading="false" />
    <div class="mt-sm">
      <ProductDetailButtonOrder v-if="detail.amount !== 0" />
    </div>
  </div>
</template>