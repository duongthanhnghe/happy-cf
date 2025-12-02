<script lang="ts" setup>
import type { ProductDTO } from '@/server/types/dto/v1/product.dto';

const props = defineProps<{
  detail: ProductDTO
}>()
</script>

<template>
  <div class="product-detail-fixed-mobile shadow-2">
    <div class="flex flex-direction-column gap-xs">
      <ProductDetailOptions v-if="detail.variantGroups.length > 0" :variantGroups="detail.variantGroups" :showHeading="false" />
    </div>
    <div class="mt-sm">
      <ProductDetailButtonOrder v-if="detail.amount !== 0" />
    </div>
  </div>
</template>