<script lang="ts" setup>
import type { ProductDTO } from '@/server/types/dto/v1/product.dto'
import { formatCurrency } from '@/utils/global';
import { computed } from 'vue';

const props = defineProps<{
  detail: ProductDTO
  variantPrice?: number
  isFlashSale?: boolean
  selectedFlashSaleItem?: {
    originalPrice: number
    salePrice: number
    percentDiscount: number
  } | null
}>()

const bestFlashSaleItem = computed(() => {
  if (!props.detail?.flashSale?.items?.length) return null

  return props.detail.flashSale.items.reduce((max, cur) =>
    cur.percentDiscount > max.percentDiscount ? cur : max
  )
})

const priceInfo = computed(() => {
  // FLASH SALE
  if (bestFlashSaleItem.value) {
    return {
      price: bestFlashSaleItem.value.salePrice,
      originalPrice: bestFlashSaleItem.value.originalPrice,
      percentDiscount: bestFlashSaleItem.value.percentDiscount,
      isFlashSale: true
    }
  }

  // NORMAL
  return {
    price: props.detail.priceDiscounts,
    originalPrice: props.detail.price,
    percentDiscount: props.detail.percentDiscount,
    isFlashSale: false
  }
})

const variantPriceInfo = computed(() => {
  const price = props.variantPrice
  if (price == null) return null

  const fsItem = props.selectedFlashSaleItem

  if (fsItem) {
    return {
      price: fsItem.salePrice,
      originalPrice: fsItem.originalPrice,
      percentDiscount: fsItem.percentDiscount,
      isFlashSale: true
    }
  }

  return {
    price,
    originalPrice: null,
    percentDiscount: null,
    isFlashSale: false
  }
})
</script>

<template>
  <div class="flex align-end gap-sm align-center justify-between">
    <!-- KHÔNG CÓ VARIANT -->
    <template v-if="!detail.variantCombinations.length">
      <div class="flex gap-sm align-center">
        <Text
          :text="formatCurrency(priceInfo.price)"
          :size="props.isFlashSale ? 'xl' : 'lg'"
          weight="semibold"
          :color="props.isFlashSale ? 'white' : 'black'"
        />

        <template v-if="priceInfo.percentDiscount && priceInfo.percentDiscount > 0">
          <Text
            :text="formatCurrency(priceInfo.originalPrice)"
            size="lg"
            :color="props.isFlashSale ? 'gray' : 'gray5'"
            class="text-line-through"
          />

          <Button
            tag="span"
            color="primary"
            size="sm"
            :label="`-${priceInfo.percentDiscount}%`"
            class="pl-sm pr-sm"
          />
        </template>
      </div>
    </template>

    <!-- CÓ VARIANT -->
    <template v-else>
      <div v-if="variantPriceInfo" class="flex gap-sm align-center">
        <Text
          :text="formatCurrency(variantPriceInfo.price)"
          :size="props.isFlashSale ? 'xl' : 'lg'"
          weight="semibold"
          :color="props.isFlashSale ? 'white' : 'black'"
        />

        <template v-if="variantPriceInfo.percentDiscount && variantPriceInfo.percentDiscount > 0">
          <Text
            :text="formatCurrency(variantPriceInfo.originalPrice)"
            size="lg"
            :color="priceInfo.isFlashSale ? 'gray' : 'gray5'"
            class="text-line-through"
          />

          <Button
            tag="span"
            color="primary"
            size="sm"
            :label="`-${variantPriceInfo.percentDiscount}%`"
            class="pl-sm pr-sm"
          />
        </template>
      </div>
    </template>
  </div>
</template>
