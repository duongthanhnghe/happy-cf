<script lang="ts" setup>
import type { ProductDTO } from '@/server/types/dto/v1/product.dto';

const props = defineProps<{
  detail: ProductDTO
}>()
</script>

<template>
  <div class="width-full position-fixed bg-white left-0 bottom-0 pd-ms transition-0d3 z-index-13 shadow-2">
    <div v-if="detail?.variantCombinations.length" class="flex flex-direction-column mb-xs">
      <ProductDetailOptions 
        :variantCombinations="detail.variantCombinations"
        sizeButton="sm"
        classCustom="overflow-x-auto scroll-hide"
      />
    </div>
    <ProductDetailButtonOrder />
  </div>
</template>