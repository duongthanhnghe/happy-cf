<script lang="ts" setup>
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { formatCurrency } from '@/utils/global'
import type { CartDTO } from '@/server/types/dto/v1/product.dto';

const props = defineProps<{
  item: CartDTO
}>()

const storeCart = useCartStore();

</script>
<template>
  <div class="bg-white border-default pd-xs flex rd-xl">
    <div class="width-100 rd-lg bg-gray6 flex">
      <Image 
        v-if="item.image"
        :src="item.image"
        :alt="item.productName"
        :width="100"
        class="rd-lg"
        preset="avatar"
      />
    </div>
    <div class="flex justify-between flex-direction-column position-relative flex-1 pd-xs pl-sm">
      <div>
        <Text :text="item.productName" color="black" limit="2" class="mb-sm pr-xl" />
        <div class="mb-xs" v-if="item.variantCombination?.variants">
          <Text
            v-for="optionItem in item.variantCombination.variants"
            :text="optionItem.groupName+': '+optionItem.variantName"
            color="gray5" size="xs"
          />
          <Text color="gray5" size="xs" :text="item.note" />
        </div>
      </div>
      <div class="flex justify-between align-end">
        <div class="flex bg-gray6 pd-xs rd-lg flex" v-if="item.id">
          <Button color="secondary" size="xs" icon="check_indeterminate_small" @click.prevent="storeCart.updateQuantity(item.productKey ? item.productKey : item.id,false)" />
          <Button disabled :border="false" size="xs" class="bg-transparent min-width-40 pd-0" :label="item.quantity" />
          <Button color="black" size="xs" icon="add" @click.prevent="storeCart.updateQuantity(item.productKey ? item.productKey : item.id,true)" />
        </div>
        <div class="flex gap-xs" v-if="item.priceDiscounts">
          <template v-if="!item.variantCombination?.variants">
            <Text color="danger" :text="formatCurrency(item.priceDiscounts)" />
            <Text v-if="item.priceDiscounts !== item.price" color="gray5" :text="formatCurrency(item.price)" class="text-line-through" />
          </template>
          <Text color="danger" v-else-if="item.variantCombination?.priceModifier !== null" :text="formatCurrency(item.variantCombination?.priceModifier)" />
        </div>
      </div>
      <div class="position-absolute right-0 top-0 flex" v-if="item.id">
        <Button color="secondary" :border="false" weightIcon="light" size="sm" icon="edit" @click.prevent="storeCart.getProductDetailEdit(item.productKey ? item.productKey : item.id)" />
        <Button color="secondary" :border="false" weightIcon="light" size="sm" icon="delete" @click.prevent="storeCart.deleteCart(item.productKey ? item.productKey : item.id)" />
      </div>
    </div>
  </div>
</template>
