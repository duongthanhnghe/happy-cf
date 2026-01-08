<script lang="ts" setup>
import type { ProductDTO } from '@/server/types/dto/v1/product.dto';
import { formatCurrency } from '@/utils/global';

const props = defineProps<{
  detail: ProductDTO
  variantPrice: number | null
}>()
</script>

<template>
  <div class="width-full position-fixed bg-white left-0 top-0 transition-0d3 z-index-13 shadow-2">
    <div class="container container-xxl flex justify-between align-center">
      <div class="pl-05 pr-05">
        <div class="flex gap-sm pt-xs pb-xs">
          <div class="bg-gray2 rd-lg max-height-80 overflow-hidden flex">
            <Image 
              :src="detail.image" :alt="detail.productName"
              :width="75"
              class="rd-md object-fit-cover"
            />
          </div>
          <div>
            <Text :text="detail.productName" size="normal" limit="2" weight="semibold" color="black" />
            <Text :text="formatCurrency(props.variantPrice !== null ? props.variantPrice : detail.priceDiscounts)" size="base" weight="medium" color="gray5" class="mt-xs" />
          </div>
        </div>
      </div>
      <div v-if="detail?.variantCombinations.length" class="border-left-default border-right-default border-color-gray2 gap-md pl-md pr-md pt-05 pb-05 flex options max-width-600">
        <ProductDetailOptions 
          :variantCombinations="detail.variantCombinations"
          showHeading
        />
      </div>
      <div class="pl-05 pr-05 flex-1 max-width-400">
        <ProductDetailButtonOrder />
      </div>
    </div>
  </div>
</template>