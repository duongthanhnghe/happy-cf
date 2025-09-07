<template>
<div v-if="product && product.isActive" class="product-template1-item">
  <div class="product-template1-image">
    <img v-lazy="product.image" :alt="product.productName" class="product-template1-image-src">
    <div v-if="product.amount == 0" class="product-template1-amount">
      {{orderText.textStockNull}}
    </div>
    <Button class="product-template1-delete" color="secondary" size="sm" icon="delete" @click="store.handleDeleteWishlist(product._id.toString())"/>
  </div>
  <div class="product-template1-content">
    <div class="product-template1-title text-limit text-limit-2">
      {{ product.productName }}
    </div>
    <div class="product-template1-price">
      <div v-if="product.priceDiscounts == product.price">{{ formatCurrency(product.priceDiscounts) }}</div>
      <div v-else v-html="`${formatCurrency(product.priceDiscounts)} <span>${formatCurrency(product.price)}</span>`"></div>
    </div>
  </div>
</div>
</template>


<script lang="ts" setup>
import {
  orderText
} from '@/const/text.js';
import '@/styles/molecules/product/product-item-template1.scss'
import {
  formatCurrency
} from '@/utils/global'

import {
  useWishlistStore
} from '@/stores/users/useWishlistStore';

const props = defineProps({
  product: {
    type: Object,
    required: true,
  }
})

const store = useWishlistStore();

</script>
