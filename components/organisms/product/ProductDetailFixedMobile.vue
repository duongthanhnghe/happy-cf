<script lang="ts" setup>
import type { ProductDTO } from '@/server/types/dto/v1/product.dto';

const props = defineProps<{
  detail: ProductDTO
}>()
</script>

<template>
  <div class="product-detail-fixed-mobile shadow-2">
    <div class="flex flex-direction-column gap-xs">
      <ProductDetailOptions 
        v-if="detail?.variantCombinations.length" 
        :variantCombinations="detail.variantCombinations"
      />
    </div>
    <div class="mt-sm">
      <ProductDetailButtonOrder />
    </div>
  </div>
</template>