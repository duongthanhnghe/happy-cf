<script lang="ts" setup>
import '@/styles/templates/cart/popup-add-item-to-cart.scss'
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { formatCurrency } from '@/utils/global';
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { useWishlistStore } from '@/stores/client/users/useWishlistStore';
import { computed } from 'vue';

const storeProductDetail = useProductDetailStore();
const storeCart = useCartStore();
const storeDisplay = useDisplayStore()
const storeWishlist = useWishlistStore();

const detail = computed(() => storeProductDetail.getDetailProduct);

</script>

<template>
  <Popup :variant="storeDisplay.isMobileTable ? 'modal-center':'modal-right'" align="bottom" popupId="popup-order" :modelValue="storeCart.getPopupState('order')" :popupHeading="storeDisplay.isMobileTable ? '':'Them gio hang'" bodyClass="pt-0 pl-0 pr-0 bg-gray2" footerFixed @update:modelValue="storeCart.togglePopup('order', false)" >
      <template #header >
        <Button v-if="detail?.id" :size="storeDisplay.isMobileTable ? 'sm':'md'" :color="storeWishlist.isInWishlist(detail?.id) ? 'black' : 'secondary'" icon="favorite" @click="storeProductDetail?.toggleLike(detail?.id)"/>
      </template>
      <template #body >
        <div class="popup-detail-product overflow-hidden">
          <div class="popup-detail-product-image">
            <img :src="detail?.image" :alt="detail?.productName" />
          </div>
          <div class="popup-detail-product-card popup-detail-product-info">
            <div class="popup-detail-product-right">
              <Heading tag="div" size="lg" weight="bold" class="black mb-sm">
                {{ detail?.productName }}
              </Heading>
              <div class="text-color-gray5 weight-semibold" v-if="detail?.priceDiscounts">
                  {{ formatCurrency(detail?.priceDiscounts) }}
              </div>
              <div class="mt-md text-size-xs pb-ms">
                {{ detail?.summaryContent }}
              </div>
            </div>
        </div>

        <template v-if="detail && detail.options.length > 0">
          <v-radio-group hide-details v-model="storeCart.selectedOptionsData[item.id as any]" :name="`radio-group-${item.id}`" :key="item.id" v-for="item in detail?.options" class="mt-sm mb-sm popup-detail-product-card">
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
            <v-textarea class="mb-0" :rows="5" v-model="storeCart.note"/>
            <div class="flex justify-center">
              <Button color="gray" icon="check_indeterminate_small" @click="storeCart.inDecrement(false)" />
              <Button :disabled="true" :border="false" color="secondary" class="popup-detail-product-quantity pd-0 text-size-large weight-medium">{{ storeCart.quantity }}</Button>
              <Button color="gray" icon="add" @click="storeCart.inDecrement(true)" />
            </div>
          </div>
        </div>
      </template>

      <template #footer>
        <Button
          :label="'Đặt hàng - ' + formatCurrency(storeCart.priceTotal)"
          class="w-full"
          color="primary"
          @handleOnClick="storeCart.addProductToCart(detail, storeCart.quantity, storeCart.note)"
        />
      </template>
  </Popup>
</template>