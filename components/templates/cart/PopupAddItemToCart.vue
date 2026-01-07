<script lang="ts" setup>
import '@/styles/templates/cart/popup-add-item-to-cart.scss'
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { formatCurrency } from '@/utils/global';
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { useWishlistStore } from '@/stores/client/users/useWishlistStore';
import { computed, watch } from 'vue';
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';

const { t } = useITranslations()
const storeProductDetail = useProductDetailStore();
const storeCart = useCartStore();
const storeDisplay = useDisplayStore()
const storeWishlist = useWishlistStore();

const detail = computed(() => storeProductDetail.getDetailProduct);

const variantGroupsUI = computed(() => {
  if (!storeProductDetail.getDetailProduct?.variantCombinations) return []
  return storeCart.variantGroupsUI(
    storeProductDetail.getDetailProduct.variantCombinations
  )
})

watch(
  () => storeCart.getPopupState('order'),
  (isOpen) => {
    if (!isOpen) return

    const groups = variantGroupsUI.value
    if (!groups.length) return

    storeCart.autoSelectFirstVariants(groups)
  }
)
</script>

<template>
  <Popup 
    :variant="storeDisplay.isMobileTable ? 'modal-center':'modal-right'" 
    :bodySpace="false" 
    align="bottom" 
    :modelValue="storeCart.getPopupState('order')" 
    :popupHeading="storeDisplay.isMobileTable ? '':'Thêm giỏ hàng'" 
    bodyClass="bg-gray2" 
    footerFixed 
    @update:modelValue="storeCart.togglePopup('order', false)"
  >
      <template #header >
        <client-only>
          <Button v-if="detail?.id" :size="storeDisplay.isMobileTable ? 'sm':'md'" :color="storeWishlist.isInWishlist(detail?.id) ? 'black' : 'secondary'" icon="favorite" @click="storeProductDetail?.toggleLike(detail?.id)"/>
        </client-only>
      </template>
      <template #body >
        <div class="popup-detail-product overflow-hidden">
          <div class="popup-detail-product-image">
            <img :src="detail?.image" :alt="detail?.productName" />
          </div>
          <div class="popup-detail-product-card popup-detail-product-info">
            <div class="popup-detail-product-right">
              <Text size="lg" weight="semibold" class="mb-xs" color="black" :text="detail?.productName" />

              <client-only>
              <Text v-if="storeProductDetail.variantPrice !== undefined && storeProductDetail.variantPrice !== null" :text="formatCurrency(storeProductDetail.variantPrice)" color="gray5" class="pb-md"/>
              </client-only>
            </div>
            <div class="flex flex-direction-column gap-ms mb-sm pb-md" v-if="detail?.variantCombinations.length">
              <ProductDetailOptions 
                :variantCombinations="detail.variantCombinations"
                showHeading
              />
            </div>
          </div>
       
          <div class="popup-detail-product-card pb-md">
            <Text size="md" weight="semibold" class="mb-sm" color="black" :text="t('product.detail.text6')" />

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
        <client-only>
          <Button
            :label="storeProductDetail.getCheckButtonOrder ? t('product.detail.text1').text : t('product.detail.text2').text"
            :disabled="!storeProductDetail.getCheckButtonOrder"
            class="w-full"
            color="primary"
            @handleOnClick="storeCart.addProductToCart(detail, storeCart.quantity, storeCart.note)"
          />
        </client-only>
      </template>
  </Popup>
</template>