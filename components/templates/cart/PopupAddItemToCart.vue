<script setup>
import '@/styles/templates/cart/popup-add-item-to-cart.scss'
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { formatCurrency } from '@/utils/global';
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { useWishlistStore } from '@/stores/client/users/useWishlistStore';

const storeProductDetail = useProductDetailStore();
const storeCart = useCartStore();
const storeDisplay = useDisplayStore()
const storeWishlist = useWishlistStore();

</script>

<template>
  <Popup :variant="storeDisplay.isMobileTable ? 'modal-center':'modal-right'" align="bottom" popupId="popup-order" :modelValue="storeProductDetail.getPopupState('order')" :popupHeading="storeDisplay.isMobileTable ? '':'Them gio hang'" bodyClass="pt-0 pl-0 pr-0 bg-gray2" @update:modelValue="storeProductDetail.togglePopup('order', false)" >
    <template #header >
      <Button :size="storeDisplay.isMobileTable ? 'sm':'md'" :color="storeWishlist.isInWishlist(storeProductDetail.getDetail?.id) ? 'black' : 'secondary'" icon="favorite" @click="toggleLike()"/>
    </template>
    <template #body>
      <div class="popup-detail-product">
        <div class="popup-detail-product-image">
          <img :src="storeProductDetail.getDetail?.image" :alt="storeProductDetail.getDetail?.productName" />
        </div>
        <div class="popup-detail-product-card popup-detail-product-info">
          <div class="popup-detail-product-right">
            <Heading tag="div" size="lg" weight="bold" class="black mb-sm">
              {{ storeProductDetail.getDetail?.productName }}
            </Heading>
            <div class="text-color-gray5 weight-semibold">
                {{ formatCurrency(parseInt(storeProductDetail.getDetail?.priceDiscounts)) }}
            </div>
            <div class="mt-md text-size-xs pb-ms">
              {{ storeProductDetail.getDetail?.summaryContent }}
            </div>
          </div>
      </div>

      <template v-if="storeProductDetail.getDetail?.options.length > 0">
        <v-radio-group hide-details v-model="storeCart.selectedOptionsData[item.id]" :name="`radio-group-${item.id}`" :key="item.id" v-for="item in storeProductDetail.getDetail?.options" class="mt-sm mb-sm popup-detail-product-card">
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
          <v-textarea class="mb-0" :rows="5" v-model="storeProductDetail.note"/>
          <div class="flex justify-center">
            <Button color="gray" icon="check_indeterminate_small" @click="storeProductDetail.inDecrement(false)" />
            <Button :disabled="true" :border="false" color="secondary" class="popup-detail-product-quantity pd-0 text-size-large weight-medium">{{ storeProductDetail.quantity }}</Button>
            <Button color="gray" icon="add" @click="storeProductDetail.inDecrement(true)" />
          </div>
        </div>
      </div>
    </template>

    <template #footer>
      <div class="portal-popup-footer">
      <Button
        :label="'Đặt hàng - ' + formatCurrency(parseInt(storeProductDetail.priceTotal))"
        class="w-full"
        color="primary"
        @handleOnClick="storeCart.addProductToCart(storeProductDetail.getDetail, storeProductDetail.quantity, storeProductDetail.note)"
      />
      </div>
    </template>
  </Popup>
</template>