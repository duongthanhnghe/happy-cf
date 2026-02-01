<script lang="ts" setup>
import type { ProductDTO } from '@/server/types/dto/v1/product.dto'
import { useBaseInformationStore } from '@/stores/client/base-information/useBaseInformationStore';
import { formatCurrency } from '@/utils/global';
import { computed } from 'vue';

const storeSetting = useBaseInformationStore();

// defineProps<{
//   detail: ProductDTO
//   variantPrice?: number
//   // percentDiscount?: string
//   isFlashSale?: boolean
// }>()

const props = defineProps<{
  detail: ProductDTO
  variantPrice?: number
  isFlashSale?: boolean
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
  const detail = props.detail
  const price = props.variantPrice
  if (!detail || price == null) return null

  // FLASH SALE
  if (detail.isFlashSale && detail.flashSale?.items?.length) {
    // lấy item có discount lớn nhất (GIỐNG product item)
    const bestItem = detail.flashSale.items.reduce((max, cur) =>
      cur.salePrice < max.salePrice ? cur : max
    )

    const originalPrice = bestItem.originalPrice
    const percentDiscount =
      originalPrice > price
        ? Math.round(((originalPrice - price) / originalPrice) * 100)
        : 0

    return {
      price,
      originalPrice,
      percentDiscount,
      isFlashSale: true
    }
  }

  // NO FLASH SALE
  // const originalPrice = detail.price
  // const percentDiscount =
  //   originalPrice > price
  //     ? Math.round(((originalPrice - price) / originalPrice) * 100)
  //     : 0
  const originalPrice = null
  const percentDiscount = null

  return {
    price,
    originalPrice,
    percentDiscount,
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
          :size="priceInfo.isFlashSale ? 'xl' : 'lg'"
          weight="semibold"
          :color="priceInfo.isFlashSale ? 'white' : 'black'"
        />

        <template v-if="priceInfo.percentDiscount && priceInfo.percentDiscount > 0">
          <Text
            :text="formatCurrency(priceInfo.originalPrice)"
            size="lg"
            :color="priceInfo.isFlashSale ? 'gray' : 'gray5'"
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

      <!-- FREESHIP -->
      <client-only>
        <template
          v-if="
            priceInfo.price &&
            storeSetting.getConfigShipping?.enabled &&
            !priceInfo.isFlashSale
          "
        >
          <v-chip
            v-if="storeSetting.calcFreeship(priceInfo.price)"
            v-tooltip.left="storeSetting.getShippingTooltip"
            label
            color="blue"
          >
            Freeship
          </v-chip>
        </template>
      </client-only>
    </template>

    <!-- CÓ VARIANT -->
    <template v-else>
      <div v-if="variantPriceInfo" class="flex gap-sm align-center">
        <Text
          :text="formatCurrency(variantPriceInfo.price)"
          :size="variantPriceInfo.isFlashSale ? 'xl' : 'lg'"
          weight="semibold"
          :color="variantPriceInfo.isFlashSale ? 'white' : 'black'"
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
    <!-- <template v-else>
      <Text
        :text="formatCurrency(variantPrice)"
        :size="priceInfo.isFlashSale ? 'xl' : 'lg'"
        weight="semibold"
        :color="priceInfo.isFlashSale ? 'white' : 'black'"
      />
    </template> -->
    <!-- KHÔNG CÓ VARIANT
    <template v-if="!detail.variantCombinations.length">
      <div class="flex align-end gap-sm align-center">
        <Text
          :text="formatCurrency(detail.priceDiscounts)"
          :size="!isFlashSale ? 'lg':'xl'"
          weight="semibold"
          :color="!isFlashSale ? 'black':'white'"
        />

        <template v-if="detail.priceDiscounts !== detail.price">
          <Text
            :text="formatCurrency(detail.price)"
            size="lg"
            color="gray5"
            class="text-line-through"
          />

          <Button
            tag="span"
            color="primary"
            size="sm"
            :label="percentDiscount"
            class="pl-sm pr-sm"
          />
        </template>
      </div>

      <client-only>
        <template
          v-if="detail.priceDiscounts && storeSetting.getConfigShipping?.enabled && !isFlashSale"
        >
          <v-chip
            v-if="storeSetting.calcFreeship(detail.priceDiscounts)"
            v-tooltip.left="storeSetting.getShippingTooltip"
            label
            color="blue"
          >
            Freeship
          </v-chip>
        </template>
      </client-only>
    </template> -->

    <!-- CÓ VARIANT -->
    <!-- <template v-else>
      <Text
        :text="formatCurrency(variantPrice)"
        :size="!isFlashSale ? 'lg':'xl'"
        weight="semibold"
        :color="!isFlashSale ? 'black':'white'"
      />
    </template> -->
  </div>
</template>
