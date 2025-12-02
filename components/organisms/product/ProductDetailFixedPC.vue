<script lang="ts" setup>
import type { ProductDTO } from '@/server/types/dto/v1/product.dto';
import { formatCurrency } from '@/utils/global';

const props = defineProps<{
  detail: ProductDTO
}>()
</script>

<template>
  <div class="product-detail-fixed-pc shadow-2">
    <div class="container container-xxl flex justify-between align-center">
      <div class="product-detail-fixed-pc-item">
        <div class="flex gap-sm">
          <div class="bg-gray2 rd-lg">
            <img :src="detail.image" :alt="detail.productName" width="75"/>
          </div>
          <div>
            <Text :text="detail.productName" size="normal" limit="2" weight="semibold" color="black" />
            <Text :text="formatCurrency(detail.priceDiscounts)" size="base" weight="medium" color="gray5" class="mt-xs" />
          </div>
        </div>
      </div>
      <div class="product-detail-fixed-pc-item flex options max-width-600">
        <ProductDetailOptions v-if="detail.variantGroups.length > 0" :variantGroups="detail.variantGroups" />
      </div>
      <div class="product-detail-fixed-pc-item flex-1 max-width-400">
        <ProductDetailButtonOrder v-if="detail.amount !== 0" />
      </div>
    </div>
  </div>
</template>