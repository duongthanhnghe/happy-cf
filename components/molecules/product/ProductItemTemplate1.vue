
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
import { useDisplayStore } from '@/stores/shared/useDisplayStore';

const props = defineProps<{
  product: ProductDTO
  listView?: Boolean
  background?: 'bg-white' | 'bg-gray7' | ''
  variant?: 'card'
  deleteFavorite?: Boolean
}>()

const storeCart = useCartStore()
const storeDisplay = useDisplayStore()
const storeProduct = useProductDetailStore()
const storeWishlist = useWishlistStore();
const storeAccount = useAccountStore();

const toggleAction = ref(false);

function handleShowAction () {
  toggleAction.value = !toggleAction.value;
};

</script>

<template>
<div 
  v-if="product && product.isActive" 
  :class="['product-template1-item position-relative overflow-hidden hover-visible-overlay', {'rd-lg pd-05 bg-white cl-shadow-1': props.variant === 'card'}, background ,listView ? 'product-template1-listView' : '']"
  >
  <div class="product-template1-image bg-gray6 position-relative rd-lg text-center overflow-hidden">
    <NuxtLink v-if="product.slug" :to="ROUTE_HELPERS.productDetail(product.slug)">
      <img v-lazy="product.image" :alt="product.productName">
      <img v-if="product.listImage.length > 0" v-lazy="product.listImage[0].src" :alt="product.productName" class="el-absolute left-0 top-0 hover-visible-overlay-el">
    </NuxtLink>
    <client-only>
      <template v-if="!props.listView">
        <Button v-if="storeAccount.getUserId && !props.deleteFavorite" 
          :class="[{'hover-visible-overlay-el': !storeWishlist.isInWishlist(product.id)}, storeDisplay.isLaptop ? 'right-sm top-sm':'right-xs top-xs','position-absolute z-index-1']" 
          :color="storeWishlist.isInWishlist(product.id) ? 'black' : 'secondary'" 
          size="xs" 
          icon="favorite" 
          @click="storeProduct.toggleLike(product.id)"
        />
        <Button 
          v-else-if="storeAccount.getUserId && props.deleteFavorite" 
          v-tooltip.left="'Xoá yêu thích'"
          :class="[storeDisplay.isLaptop ? 'right-sm top-sm':'right-xs top-xs','position-absolute z-index-2']" 
          color="secondary" 
          size="sm" 
          icon="delete" 
          @click="storeWishlist.handleDeleteWishlist(product.id)"
        />
        <template v-else />
      </template>
    </client-only>
    <div v-if="product.amount === 0 && !product.variantCombinations.length" class="text-color-white bg-black-20 el-absolute left-0 top-0 flex justify-center align-center">
      {{orderText.textStockNull}}
    </div>
    <div v-else>
      <div v-if="storeCart.getTemplate1Amount(product.id) < 1">
        <Button 
          color="primary" 
          size="xs" 
          :class="[storeDisplay.isLaptop ? 'right-sm bottom-sm':'right-xs bottom-xs','z-index-2 position-absolute']" 
          icon="add"
          @click="() => { product.variantCombinations.length > 0 ? storeCart.getProductDetailApi(product.id) : storeCart.addProductToCart(product, 1, '')}"
        />
      </div>
      <div v-else>
        <Button 
          :class="[storeDisplay.isLaptop ? 'right-sm bottom-sm':'right-xs bottom-xs', 'button-no-text z-index-2 position-absolute']" 
          color="secondary"
          size="xs"
          @click="() => { product.variantCombinations.length > 0 ? storeCart.getProductDetailApi(product.id) : handleShowAction()}"
          :label="storeCart.getTemplate1Amount(product.id)"
        />
      </div>
    </div>
    <img class="el-absolute left-0 bottom-0 height-auto" v-if="product.vouchers?.image" :alt="product.productName" :src="product.vouchers.image" />
  </div>
  <div v-if="storeCart.getTemplate1Amount(product.id) > 0" :class="['product-template1-action el-absolute left-0 top-0 flex justify-center align-center z-index-2',toggleAction ? 'hover-visible-overlay-el active transform-scale-1' : 'transform-scale-0']">
    <div class="product-template1-action-before el-absolute left-0 top-0 bg-white-70" @click="handleShowAction()"></div>
    <div class="product-template1-input z-index-2 bg-white rd-xl flex align-center pd-xs position-relative shadow-1">
      <Button 
        v-if="storeCart.getTemplate1Amount(product.id) == 1" 
        icon="delete" 
        color="secondary" 
        :border="false"
        size="sm"
        class="product-template1-delete position-absolute z-index-2" 
        @click="storeCart.deleteCart(product.id)"
      />
      <Button 
        class="product-template1-input-btn" 
        color="secondary" 
        icon="add" 
        :border="false"
        size="sm"
        @click.prevent="storeCart.updateQuantity(product.id,false)"
      />
      <Button
        class="product-template1-input-btn pl-0 pr-0 text-size-md weight-medium" 
        tag="span"
        color="secondary" 
        :label="storeCart.getTemplate1Amount(product.id)" 
        :border="false"
        size="sm"
        disabled
        @click.prevent="storeCart.updateQuantity(product.id,true)" 
      />
      <Button
        class="product-template1-input-btn" 
        color="secondary" 
        icon="add" 
        :border="false"
        size="sm"
        @click.prevent="storeCart.updateQuantity(product.id,true)" 
      />
    </div>
  </div>
  <div :class="[{'pd-05': props.variant === 'card'},'product-template1-content pt-ms']">
    <NuxtLink 
      v-if="product.slug" 
      :to="ROUTE_HELPERS.productDetail(product.slug)"
    >
      <Text :text="product.productName" limit="2" class="mb-sm line-height-1d4" />
    </NuxtLink>
    <div class="product-template1-price flex gap-xs align-center">
      <Text class="line-height-1" weight="semibold">{{ formatCurrency(product.priceDiscounts) }}</Text>
      <template v-if="product.percentDiscount && product.percentDiscount !== 0">
        <Text color="gray5" size="xs" class='line-height-1 text-line-through'>{{ formatCurrency(product.price) }}</Text>
        <Button tag="div" color="primary" size="xs" :label="`-${product.percentDiscount}%`" class="pl-xs pr-xs rd-lg height-auto line-height-1d2" />
      </template>
    </div>
  </div>
</div>
</template>

