<template>
<div v-if="product && product.isActive" :class="['product-template1-item', background ,listView ? 'product-template1-listView' : '' ,storeCart.getTemplate1Amount(product.id) != 0 ? 'active' : '']">
  <div class="product-template1-image">
    <img v-lazy="product.image" :alt="product.productName" class="product-template1-image-src">
    <Button v-if="storeAccount.getDetailValue?.id" class="product-template1-favorite" :color="`${isFavorite ? 'black' : 'secondary'}`" size="xs" icon="favorite" @click="toggleLike()"/>
    <div v-if="product.amount == 0" class="product-template1-amount">
      {{orderText.textStockNull}}
    </div>

    <div v-else>
      <div v-if="storeCart.getTemplate1Amount(product.id) < 1">
        <Button v-if="product.options.length > 0" color="primary" size="xs" class="product-template1-plus" @click="handleShowPopupDetail(product.id)">
          <MaterialIcon name="check_indeterminate_small" />
        </Button>
        <Button v-else class="product-template1-plus" color="primary" size="xs" @click="storeCart.addProductToCart(product, 1, '')">
          <MaterialIcon name="add" />
        </Button>
      </div>
      <div v-else>
        <div v-if="product.options.length > 0" class="product-template1-plus product-template1-plus-number" @click="handleShowPopupDetail(product.id)">
          {{ storeCart.getTemplate1Amount(product.id) }}
        </div>
        <div v-else class="product-template1-plus product-template1-plus-number" @click="handleShowAction()">
          {{ storeCart.getTemplate1Amount(product.id) }}
        </div>
      </div>
    </div>
  </div>
  <div v-if="storeCart.getTemplate1Amount(product.id) > 0" :class="['product-template1-action',toggleAction ? 'active' : '']">
    <div class="product-template1-action-before" @click="handleShowAction()"></div>
    <div class="product-template1-input">
      <div v-if="storeCart.getTemplate1Amount(product.id) == 1" class="product-template1-delete" @click="handleDeleteCart(product.id)">
        <MaterialIcon name="delete" />
      </div>
      <Button class="product-template1-input-btn" icon="check_indeterminate_small" @click.prevent="handleInDecrementCart(product.id,false)" />
      <div class="product-template1-input-quantity">{{ storeCart.getTemplate1Amount(product.id) }}</div>
      <Button class="product-template1-input-btn" icon="add" @click.prevent="handleInDecrementCart(product.id,true)" />
    </div>
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
  defineProps,
  ref,
  watch,
  computed
} from 'vue'
import {
  useCartStore
} from '../../../stores/product/useCartOrderStore'
import {
  useProductStore
} from '../../../stores/product/useProductOrderStore'
import {
  useWishlistStore
} from '@/stores/users/useWishlistStore';
import {
  useAccountStore
} from '@/stores/users/useAccountStore';
import type { ProductDTO } from '@/server/types/dto/product.dto';


const storeCart = useCartStore()
const storeProduct = useProductStore()
const storeWishlist = useWishlistStore();
const storeAccount = useAccountStore();
const toggleAction = ref(false);

const handleShowAction = () => {
  toggleAction.value = !toggleAction.value;
};

const props = defineProps<{
  product: ProductDTO
  listView?: Boolean
  background?: 'bg-white' | 'bg-gray7'
}>()

const handleInDecrementCart = (idProduct: string, type: boolean) => {
  storeCart.updateQuantity(idProduct, type);
};

const handleDeleteCart = (idProduct: string) => {
  storeCart.deleteCart(idProduct);
};

const handleShowPopupDetail = async (idProduct: string) => {
  await storeProduct.getProductDetailApi(idProduct);
}

const isFavorite = computed(() =>
  storeWishlist.isInWishlist(props.product.id)
)

const toggleLike = async () => {
  if (isFavorite.value) {
    await storeWishlist.handleDeleteWishlist(props.product.id)
  }
  else {
    await storeWishlist.handleAddWishlist(props.product.id)
  }
}
</script>