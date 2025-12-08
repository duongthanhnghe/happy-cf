
<script lang="ts" setup>
import {
  orderText
} from '@/const/text.js';
import '@/styles/molecules/product/product-item-template1.scss'
import {
  formatCurrency
} from '@/utils/global'
import {
  ref,
} from 'vue'
import {
  useCartStore
} from '@/stores/client/product/useCartOrderStore'
import {
  useProductDetailStore
} from '@/stores/client/product/useProductDetailStore'
import {
  useWishlistStore
} from '@/stores/client/users/useWishlistStore';
import {
  useAccountStore
} from '@/stores/client/users/useAccountStore';
import type { ProductDTO } from '@/server/types/dto/v1/product.dto';
import { ROUTE_HELPERS } from '@/shared/constants/routes-helpers';

const props = defineProps<{
  product: ProductDTO
  listView?: Boolean
  background?: 'bg-white' | 'bg-gray7' | ''
  variant?: 'card'
  deleteFavorite?: Boolean
}>()

const storeCart = useCartStore()
const storeProduct = useProductDetailStore()
const storeWishlist = useWishlistStore();
const storeAccount = useAccountStore();
const toggleAction = ref(false);

const handleShowAction = () => {
  toggleAction.value = !toggleAction.value;
};

</script>

<template>
<div v-if="product && product.isActive" :class="['product-template1-item', `variant-${variant}`, background ,listView ? 'product-template1-listView' : '' ,storeCart.getTemplate1Amount(product.id) != 0 ? 'active' : '']">
  <div class="product-template1-image">
    <NuxtLink v-if="product.slug" :to="ROUTE_HELPERS.productDetail(product.slug)">
      <img v-lazy="product.image" :alt="product.productName" class="product-template1-image-src">
    </NuxtLink>
    <client-only>
      <template v-if="!props.listView">
        <Button v-if="storeAccount.getUserId && !props.deleteFavorite" class="product-template1-favorite" :color="storeWishlist.isInWishlist(product.id) ? 'black' : 'secondary'" size="xs" icon="favorite" @click="storeProduct.toggleLike(product.id)"/>
        <Button v-else-if="storeAccount.getUserId && props.deleteFavorite" class="product-template1-favorite" color="secondary" size="sm" icon="delete" @click="storeWishlist.handleDeleteWishlist(product.id)"/>
        <template v-else />
      </template>
    </client-only>
    <div v-if="product.amount == 0" class="product-template1-amount">
      {{orderText.textStockNull}}
    </div>

    <div v-else>
      <div v-if="storeCart.getTemplate1Amount(product.id) < 1">
        <Button v-if="product.variantGroups.length > 0" color="primary" size="xs" class="product-template1-plus" @click="storeCart.getProductDetailApi(product.id)">
          <MaterialIcon name="add" />
        </Button>
        <Button v-else class="product-template1-plus" color="primary" size="xs" @click="storeCart.addProductToCart(product, 1, '')">
          <MaterialIcon name="add" />
        </Button>
      </div>
      <div v-else>
        <div v-if="product.variantGroups.length > 0" class="product-template1-plus product-template1-plus-number" @click="storeCart.getProductDetailApi(product.id)">
          {{ storeCart.getTemplate1Amount(product.id) }}
        </div>
        <div v-else class="product-template1-plus product-template1-plus-number" @click="handleShowAction()">
          {{ storeCart.getTemplate1Amount(product.id) }}
        </div>
      </div>
    </div>

    <div v-if="product.vouchers">
      <img class="product-template1-voucher" v-if="product.vouchers.image" :alt="product.productName" :src="product.vouchers.image" />
    </div>
  </div>
  <div v-if="storeCart.getTemplate1Amount(product.id) > 0" :class="['product-template1-action',toggleAction ? 'active' : '']">
    <div class="product-template1-action-before" @click="handleShowAction()"></div>
    <div class="product-template1-input">
      <div v-if="storeCart.getTemplate1Amount(product.id) == 1" class="product-template1-delete" @click="storeCart.deleteCart(product.id)">
        <MaterialIcon name="delete" />
      </div>
      <Button class="product-template1-input-btn" icon="add" @click.prevent="storeCart.updateQuantity(product.id,false)" />
      <div class="product-template1-input-quantity">{{ storeCart.getTemplate1Amount(product.id) }}</div>
      <Button class="product-template1-input-btn" icon="add" @click.prevent="storeCart.updateQuantity(product.id,true)" />
    </div>
  </div>
  <div class="product-template1-content">
    <NuxtLink 
      v-if="product.slug" 
      class="product-template1-title text-limit text-limit-2" 
      :to="ROUTE_HELPERS.productDetail(product.slug)"
    >
      {{ product.productName }}
    </NuxtLink>
    <div class="product-template1-price">
      <div v-if="product.priceDiscounts == product.price">{{ formatCurrency(product.priceDiscounts) }}</div>
      <div v-else v-html="`${formatCurrency(product.priceDiscounts)} <span>${formatCurrency(product.price)}</span>`"></div>
    </div>
  </div>
</div>
</template>

