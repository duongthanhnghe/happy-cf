<script setup>
import {
  computed, watch
} from 'vue'
import {
  useProductStore
} from '@/stores/client/product/useProductOrderStore'
import {
  useCartStore
} from '@/stores/client/product/useCartOrderStore'
import {
  useAccountStore
} from '@/stores/client/users/useAccountStore';
import {
  useWishlistStore
} from '@/stores/client/users/useWishlistStore';
import { formatCurrency } from '@/utils/global';
import '@/styles/templates/cart/popup-add-item-to-cart.scss'
import {
  useDisplayStore
} from '@/stores/shared/useDisplayStore'

//store
const storeProduct = useProductStore();
const storeCart = useCartStore();
const storeAccount = useAccountStore();
const storeWishlist = useWishlistStore();
const storeDisplay = useDisplayStore()

const setTogglePopup = () => {
  storeProduct.togglePopup('order', false);
}

const handleChangeVariant = (...item) => {
  storeCart.setSelectedOptionsData(...item);
  storeProduct.priceOptions = storeCart.getSelectedOptionsData.reduce((total, item) => total + item.variantPrice, 0);
  storeProduct.calcTotalPrice("order");
}

const handleInDecrement = (type) => {
    storeProduct.inDecrement(type);
}

const isFavorite = computed(() =>
  storeWishlist.isInWishlist(storeProduct.getProductDetailData?.id)
)

const toggleLike = async () => {
  if (isFavorite.value) {
    await storeWishlist.handleDeleteWishlist(storeProduct.getProductDetailData.id)
  }
  else {
    await storeWishlist.handleAddWishlist(storeProduct.getProductDetailData.id)
  }
}

watch(() => storeProduct.getProductDetailData, (newValue) => {
  if(newValue?.id){
    storeProduct.setQuantity(1)
    storeProduct.setPriceTotal(storeProduct.getProductDetailData.priceDiscounts)
  }
}, {
  immediate: true
});
</script>

<template>
  <Popup :variant="storeDisplay.isMobileTable ? 'modal-center':'modal-right'" align="bottom" popupId="popup-order" :modelValue="storeProduct.getPopupState('order')" :popupHeading="storeDisplay.isMobileTable ? '':'Them gio hang'" bodyClass="pt-0 pl-0 pr-0 bg-gray2" @update:modelValue="setTogglePopup" >
    <template #header >
      <Button :size="storeDisplay.isMobileTable ? 'sm':'md'" :color="`${isFavorite ? 'black' : 'secondary'}`" icon="favorite" @click="toggleLike()"/>
    </template>
    <template #body>
      <div class="popup-detail-product">
        <div class="popup-detail-product-image">
          <img :src="storeProduct.getProductDetailData?.image" :alt="storeProduct.getProductDetailData?.productName" />
        </div>
        <div class="popup-detail-product-card popup-detail-product-info">
          <div class="popup-detail-product-right">
            <Heading tag="div" size="lg" weight="bold" class="black mb-sm">
              {{ storeProduct.getProductDetailData?.productName }}
            </Heading>
            <div class="text-color-gray5 weight-semibold">
                {{ formatCurrency(parseInt(storeProduct.getProductDetailData?.priceDiscounts)) }}
            </div>
            <div class="mt-md text-size-xs pb-ms">
              {{ storeProduct.getProductDetailData?.summaryContent }}
            </div>
          </div>
      </div>

      <template v-if="storeProduct.getProductDetailData?.options.length > 0">
        <v-radio-group hide-details v-model="storeCart.selectedOptionsData[item.id]" :name="`radio-group-${item.id}`" :key="item.id" v-for="item in storeProduct.getProductDetailData?.options" class="mt-sm mb-sm popup-detail-product-card">
          <Heading tag="div" size="md" weight="semibold" class="black pt-sm pl-ms pr-ms">
            {{ item.name }}
          </Heading>
          <v-radio v-for="variant in item.variants" class="popup-detail-product-variant" rel="js-popup-detail-variant-item" :value="variant.id">
            <template #label>
              <div class="flex justify-between w-full">
                {{ variant.name }}
                <span v-if="variant.priceModifier !== 0">+{{ formatCurrency(variant.priceModifier) }}</span>
                <span v-else>0</span>
              </div>
            </template>
          </v-radio>
        </v-radio-group>
      </template>
        
        <div class="popup-detail-product-card pb-md">
          <Heading tag="div" size="md" weight="semibold" class="black mb-sm">
            Them luu y cho quan
          </Heading>
          <v-textarea class="mb-0" :rows="5" v-model="storeProduct.note"/>
          <div class="flex justify-center">
            <Button color="gray" icon="check_indeterminate_small" @click="handleInDecrement(false)" />
            <Button :disabled="true" :border="false" color="secondary" class="popup-detail-product-quantity pd-0 text-size-large weight-medium">{{ storeProduct.getQuantity }}</Button>
            <Button color="gray" icon="add" @click="handleInDecrement(true)" />
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="portal-popup-footer">
      <Button
        :label="'Đặt hàng - ' + formatCurrency(parseInt(storeProduct.getPriceTotal))"
        class="w-full"
        color="primary"
        @handleOnClick="storeCart.addProductToCart(storeProduct.getProductDetailData, storeProduct.getQuantity, storeProduct.note)"
      />
      </div>
    </template>
  </Popup>
</template>