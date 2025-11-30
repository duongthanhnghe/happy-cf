<script lang="ts" setup>
import '@/styles/molecules/cart/cart-item-template1.scss'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { formatCurrency } from '@/utils/global'
import type { CartDTO } from '@/server/types/dto/v1/product.dto';

const props = defineProps<{
  item: CartDTO
}>()

const storeCart = useCartStore();

const getOriginalPrice = (item: any) => {
  if (item.finalPrice){
    if (item.finalPrice !== item.finalPriceDiscounts){
      return item.finalPrice
    } else {
      return ''
    }
  }
  if (item.price && item.price !== item.priceDiscounts) return item.price
  return ''
}

</script>
<template>
  <div class="cart-template1-item rd-xl">
    <div class="cart-template1-image">
      <img :src="item.image" :alt="item.productName" />
    </div>
    <div class="cart-template1-info">
      <div>
        <Text :text="item.productName" color="black" class="mb-sm" />
        <div class="cart-template1-options">
          <Text
            v-if="item.selectedOptionsPush"
            v-for="optionItem in item.selectedOptionsPush"
            :text="`${ optionItem.variantName } ${optionItem.variantPrice !== 0 ? `(+${ formatCurrency(optionItem.variantPrice) })`:''}`"
            color="gray5" size="xs"
          />
          <Text color="gray5" size="xs" :text="item.note" />
        </div>
      </div>
      <div class="cart-template1-action">
        <div class="cart-template1-input" v-if="item.id">
          <Button color="secondary" size="xs" icon="check_indeterminate_small" @click.prevent="storeCart.updateQuantity(item.productKey ? item.productKey : item.id,false)" />
          <Button disabled :border="false" size="xs" class="bg-transparent cart-template1-quantity pd-0" :label="item.quantity" />
          <Button color="black" size="xs" icon="add" @click.prevent="storeCart.updateQuantity(item.productKey ? item.productKey : item.id,true)" />
        </div>
        <div class="flex gap-xs">
          <Text color="danger" v-if="item.priceDiscounts" :text="formatCurrency(item.finalPriceDiscounts ? item.finalPriceDiscounts : item.priceDiscounts)" />
          <Text color="gray4" class="text-line-through" v-if="getOriginalPrice(item) !== ''" :text="formatCurrency(getOriginalPrice(item))" />
        </div>
      </div>
      <div class="cart-template1-delete flex" v-if="item.id">
        <Button color="secondary" :border="false" size="sm" icon="edit" @click.prevent="storeCart.getProductDetailEdit(item.productKey ? item.productKey : item.id)" />
        <Button color="secondary" :border="false" size="sm" icon="delete" @click.prevent="storeCart.deleteCart(item.productKey ? item.productKey : item.id)" />
      </div>
    </div>
  </div>
</template>
