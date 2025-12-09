<script lang="ts" setup>
import type { ProductVariantGroupDTO } from '@/server/types/dto/v1/product.dto';
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore';

const storeCart = useCartStore()
const storeProductDetail = useProductDetailStore()
const props = withDefaults(defineProps<{
  variantGroups: ProductVariantGroupDTO[],
  showHeading?: boolean
}>(), {
  showHeading: true
})
</script>

<template>
  <v-radio-group 
    v-if="variantGroups"
    hide-details 
    v-model="storeCart.tempSelected[item.groupId]" 
    :name="`radio-group-${item.groupId}`"
    :key="item.groupId" v-for="item in props.variantGroups" 
    @update:modelValue="(val) => {
      const variant = item.selectedVariants.find(v => v.variantId === val);
      if (variant && val) {
        storeCart.handleSelectVariant(item.groupId, val, item.groupName, variant.variantName, variant.priceModifier || 0);
        if (variant.image && variant.image.trim() !== '') {
          storeProductDetail.goToImageBySrc(variant.image);
        }
      } 
    }"
  >
    <Text 
      v-if="showHeading" 
      v-html="`${item.groupName}: <span class='text-color-black weight-semibold ml-xs'>${(item.selectedVariants || []).find(v => v.variantId === storeCart.tempSelected[item.groupId])?.variantName ?? ''}</span>`"
      color="gray5" 
      size="base" 
      class="mt-ms product-detail-options-heading"
    />
    <div class="flex gap-sm mt-xs scroll-hide popup-detail-options-list">
    <v-radio 
      v-for="variant in item.selectedVariants" 
      class="product-detail-options" 
      rel="js-popup-detail-variant-item" 
      :value="variant.variantId"
      :disabled="!variant.inStock || !variant.stock || variant.stock === 0"
      >
      <template #label>
        <Button tag="span" color="gray" :border="false" class="cursor-pointer weight-normal" :label="variant.variantName" />
      </template>
    </v-radio>
    </div>
  </v-radio-group>
</template>