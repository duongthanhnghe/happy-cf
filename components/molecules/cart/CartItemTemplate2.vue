<script lang="ts" setup>
import { formatCurrency } from '@/utils/global'
import type { cartItems } from '@/server/types/dto/v1/order.dto';
import { useOrderHelpers } from '@/utils/orderHelpers';

const {
  getFlashAppliedQty,
  getNormalQty,
  getOriginalUnitPrice,
  getFlashUnitPrice,
  getNormalUnitPrice,
} = useOrderHelpers()

const props = defineProps<{
  item: cartItems
  gift?: boolean
}>()

</script>
<template>
  <div v-if="typeof props.item.idProduct === 'object'" class="flex bg-white pd-xs border-default rd-xl flex-1">
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
      <TagFlashSale v-if="props.item.isFlashSale" class="mb-xs"/>
      <v-chip v-if="gift" label size="small" color="green" class="mb-sm">
        Quà tặng
      </v-chip>
      <Text size="sm" weight="medium" limit="1" class="mb-xs pr-0" :text="props.item?.idProduct?.productName" />
      <div class="text-color-gray5 text-size-xs" v-if="item.variantCombination">
        <div v-for="itemV in item.variantCombination.variants" :key="itemV.variantId">
          {{ itemV.groupName }}: <span>{{ itemV.variantName }}</span>
        </div>
        <div class="text-color-gray5 text-size-xs">
          {{ item.note }}
        </div>
      </div>
    
      <div class="flex gap-xs flex-direction-column align-end">
        <!-- FLASH SALE -->
        <template v-if="item.isFlashSale && getFlashAppliedQty(item)">
          <div class="flex gap-xs">
            <Button size="xs" color="secondary" :label="`x${getFlashAppliedQty(item)}`" />
            <Text text="-" color="gray4" />
            <Text color="danger" :text="formatCurrency(getFlashUnitPrice(item))" />
            <Text
              class="text-line-through"
              color="gray5"
              :text="formatCurrency(getOriginalUnitPrice(item))"
            />
          </div>
        </template>

        <!-- GIÁ THƯỜNG -->
        <template v-if="getNormalQty(item)">
          <div class="flex gap-xs">
            <Button size="xs" color="secondary" :label="`x${getNormalQty(item)}`" />
            <Text text="-" color="gray4" />
            <Text color="danger" :text="formatCurrency(getNormalUnitPrice(item))" />
            <Text
              v-if="getNormalUnitPrice(item) !== getOriginalUnitPrice(item)"
              class="text-line-through"
              color="gray5"
              :text="formatCurrency(getOriginalUnitPrice(item))"
            />
          </div>
        </template>
      </div>
    </div>
  </div>
</template>