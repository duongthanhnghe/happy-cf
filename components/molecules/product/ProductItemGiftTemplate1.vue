<script lang="ts" setup>
import { formatCurrency } from '@/utils/global'
import type { ProductDTO } from '@/server/types/dto/v1/product.dto'

const props = defineProps<{
  item: ProductDTO
  quantity: number
}>()

</script>

<template>
  <div class="flex bg-white flex-1">
    <div class="width-100">
      <Image 
        v-if="props.item.image"
        :src="props.item.image" 
        :alt="props.item.productName"
        class="rd-lg"
        preset="avatar"
      />
    </div>
    <div class="flex-1 pd-xs pl-sm">
      <Text size="sm" weight="semibold" limit="1" class="mb-xs" :text="props.item?.productName" />
      <div class="mt-xs">
        <div class="flex gap-xs align-center mt-sm mb-sm">
          <Text class="line-height-1" weight="semibold" >{{ formatCurrency(0) }}</Text>
          <Text v-if="item.price" color="gray5" class='line-height-1 text-line-through'>{{ formatCurrency(item.price) }}</Text>
        </div>
        <Button tag="span" size="xs" color="secondary" class="text-size-xs" :label="`x${quantity}`"/>
      </div>
    </div>
  </div>
</template>