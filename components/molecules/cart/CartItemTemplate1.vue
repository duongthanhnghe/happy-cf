<script lang="ts" setup>
import '@/styles/molecules/cart/cart-item-template1.scss'
import {
  useCartStore
} from '@/stores/client/product/useCartOrderStore'
import {
  defineProps
} from 'vue'
import {
  formatCurrency
} from '@/utils/global'
import {
  useProductDetailStore
} from '@/stores/client/product/useProductDetailStore'
import type { CartDTO } from '@/server/types/dto/v1/product.dto';

const props = defineProps<{
  item: CartDTO
}>()

const storeProduct = useProductDetailStore()
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
  <div class="cart-template1-item">
    <div class="cart-template1-image">
      <img :src="item.image" :alt="item.productName" />
    </div>
    <div class="cart-template1-info">
      <div>
        <Heading tag="div" size="sm" weight="medium" class="black text-limit text-limit-2 mb-sm">
          {{ item.productName }}
        </Heading>
        <div class="cart-template1-options">
          <div v-for="optionItem in item.selectedOptionsPush">
              {{ optionItem.optionName }}:  <span>{{ optionItem.variantName }} </span> (+{{ formatCurrency(optionItem.variantPrice) }})
          </div>
          {{ item.note }}
        </div>
      </div>
      <div class="cart-template1-action">
        <div class="cart-template1-input">
          <Button v-if="item.productKey" color="secondary" size="xs" icon="check_indeterminate_small" @click.prevent="storeCart.updateQuantity(item.productKey,false)" />
          <Button v-else color="secondary" size="xs" icon="check_indeterminate_small" @click.prevent="storeCart.updateQuantity(item.id,false)" />

          <Button :disabled="true" :border="false" size="xs" color="gray" class="cart-template1-quantity pd-0" :label="item.quantity" />

          <Button v-if="item.productKey" color="secondary" size="xs" icon="add" @click.prevent="storeCart.updateQuantity(item.productKey,true)" />
          <Button v-else color="secondary" size="xs" icon="add" @click.prevent="storeCart.updateQuantity(item.id,true)" />
        </div>
        <div class="flex gap-xs">
          <span class="text-color-danger">{{ formatCurrency(item.finalPriceDiscounts ? item.finalPriceDiscounts : item.priceDiscounts) }}</span>
          <span class="text-color-gray5 text-line-through" v-if="getOriginalPrice(item) !== ''">{{ formatCurrency(getOriginalPrice(item)) }}</span>
        </div>
      </div>
      <div class="cart-template1-delete flex">
        <Button v-if="item.productKey" color="secondary" :border="false" size="sm" icon="edit" @click.prevent="storeProduct.getProductDetailEdit(item.productKey)" />
        <Button v-else color="secondary" :border="false" size="sm" icon="edit" @click.prevent="storeProduct.getProductDetailEdit(item.id)" />
        <Button color="secondary" :border="false" size="sm" icon="delete" @click.prevent="storeCart.deleteCart(item.id)" />
      </div>
    </div>
  </div>
</template>
