<script lang="ts" setup>
import { formatCurrency } from '@/utils/global'
import type { cartItems } from '@/server/types/dto/v1/order.dto';

const props = defineProps<{
  item: cartItems
}>()

</script>
<template>
  <div class="flex bg-white pd-xs border-default rd-xl flex-1">
    <div class="width-100">
      <Image 
        v-if="props.item.idProduct?.image"
        :src="props.item.idProduct?.image" 
        :alt="props.item.idProduct?.productName"
        class="rd-lg"
        preset="avatar"
      />
    </div>
    <div class="flex-1 pd-xs pl-sm">
      <Text size="sm" weight="medium" limit="1" class="mb-xs pr-0" :text="props.item?.idProduct?.productName" />
      <div class="text-color-gray5 text-size-xs" v-if="item.variantCombination">
        <div v-for="itemV in item.variantCombination.variants" :key="itemV.variantId">
          {{ itemV.groupName }}: <span>{{ itemV.variantName }}</span>
        </div>
        <div class="text-color-gray5 text-size-xs">
          {{ item.note }}
        </div>
      </div>
      <div class="flex justify-between align-end mt-xs">
        <Button size="xs" color="secondary" class="text-size-xs" :label="`x${item.quantity}`"/>
        <Text v-if="item.price" :text="`${formatCurrency(item.price)}`" color="gray5" />
      </div>
    </div>
  </div>
</template>