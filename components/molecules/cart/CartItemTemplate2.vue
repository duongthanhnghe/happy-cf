<script lang="ts" setup>
import '@/styles/molecules/cart/cart-item-template1.scss'
import { formatCurrency } from '@/utils/global'
import type { selectedOptionsPush } from '@/server/types/dto/v1/order.dto';

const props = defineProps<{
  data: {
    image: string
    productName: string
  }
  finalPriceDiscounts?: number
  note?: string
  priceDiscounts: number
  quantity: number
  selectedOptionsPush?: selectedOptionsPush[]
}>()

</script>
<template>
  <div class="cart-template1-item flex-1">
    <div class="cart-template1-image">
      <img :src="props.data?.image" :alt="props.data?.productName" />
    </div>
    <div class="cart-template1-info">
      <Heading tag="div" size="sm" weight="medium" class="pr-0 text-limit mb-xs">
        {{ props.data?.productName }}
      </Heading>
      <div class="text-color-gray5 text-size-xs">
        <div v-for="item in props.selectedOptionsPush" :key="item.optionName">
          {{ item.optionName }}: <span>{{ item.variantName }}</span>
        </div>
        <div class="text-color-gray5 text-size-xs">
          {{ props.note }}
        </div>
      </div>
      <div class="cart-template1-action mt-xs">
        <Button size="xs" color="secondary" class="text-size-xs" :label="`x${props.quantity}`"/>
        <div class="cart-template1-price text-color-gray5">
          {{ formatCurrency(props.finalPriceDiscounts ? props.finalPriceDiscounts : props.priceDiscounts) }}
        </div>
      </div>
    </div>
  </div>
</template>