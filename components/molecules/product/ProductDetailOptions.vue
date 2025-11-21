<script lang="ts" setup>
import type { OptionDTO } from '@/server/types/dto/v1/product.dto';
import { useCartStore } from '@/stores/client/product/useCartOrderStore'

const storeCart = useCartStore()
const props = withDefaults(defineProps<{
  options: OptionDTO[],
  showHeading?: boolean
}>(), {
  showHeading: true
})
</script>

<template>
  <v-radio-group hide-details v-model="storeCart.selectedOptionsData[item.id as any]" :name="`radio-group-${item.id}`" :key="item.id" v-for="item in props.options">
    <Text 
      v-if="showHeading" 
      v-html="`${item.name}: <span class='text-color-black weight-semibold ml-xs'>${item.variants.find(v => v.id === storeCart.selectedOptionsData[item.id])?.name ?? ''}</span>`"
      color="gray5" 
      size="base" 
      class="mt-ms product-detail-options-heading"
    />
    <div class="flex gap-sm mt-xs scroll-hide popup-detail-options-list">
    <v-radio v-for="variant in item.variants" class="product-detail-options" rel="js-popup-detail-variant-item" :value="variant.id">
      <template #label>
        <Button tag="span" color="gray" :border="false" class="cursor-pointer weight-normal" :label="variant.name" />
      </template>
    </v-radio>
    </div>
  </v-radio-group>
</template>