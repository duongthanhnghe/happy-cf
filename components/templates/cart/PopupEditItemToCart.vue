<script lang="ts" setup>
import '@/styles/templates/cart/popup-add-item-to-cart.scss'
import { computed } from 'vue'
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { formatCurrency } from '@/utils/global';

const storeProduct = useProductDetailStore();
const storeCart = useCartStore();
const storeDisplay = useDisplayStore()

const detail = computed(() => storeCart.getProductDetailDataEdit);
// const detailProduct = computed(() => storeProduct.getDetailProduct);

</script>

<template>
  <Popup 
    :children="storeCart.isTogglePopup ? true: false" 
    :variant="storeDisplay.isMobileTable ? 'modal-center':'modal-right'" 
    :bodySpace="false" footerFixed align="bottom" 
    :modelValue="storeCart.getPopupState('edit')" 
    :popupHeading="storeDisplay.isMobileTable ? '':'Sửa sản phẩm'" 
    @update:modelValue="storeCart.togglePopup('edit', false)"
    bodyClass="bg-gray2" 
  >
    <template #body v-if="detail">
      <div class="popup-detail-product overflow-hidden">
        <div class="popup-detail-product-image">
          <img :src="detail?.image" :alt="detail?.productName" />
        </div>
        <div class="popup-detail-product-card popup-detail-product-info">
          <div class="popup-detail-product-right">
            <Heading tag="div" size="lg" weight="semibold" class="black mb-xs">
              {{ detail?.productName }}
            </Heading>
            <Text v-if="storeProduct.variantPrice !== undefined && storeProduct.variantPrice !== null" :text="formatCurrency(storeProduct.variantPrice)" color="gray5" class="pb-md"/>
          </div>
          <div class="flex flex-direction-column gap-ms mb-sm pb-md" v-if="detail?.variantCombinations?.length">
            <ProductDetailOptions 
              :variantCombinations="detail.variantCombinations"
              showHeading
            />
          </div>
        </div>

        <div class="popup-detail-product-card pb-md">
          <Heading tag="div" size="md" weight="semibold" class="black mb-sm">
            Thêm lưu ý
          </Heading>
          <v-textarea class="mb-0" :rows="5" v-model="detail.note" :value="detail.note"/>

          <div class="flex justify-center">
            <Button color="gray" icon="check_indeterminate_small" @click="storeCart.inDecrementEdit(false)" />
            <Button :disabled="true" :border="false" color="secondary" class="popup-detail-product-quantity pd-0 text-size-large weight-medium" :label="storeCart.quantityEdit"/>
            <Button color="gray" icon="add" @click="storeCart.inDecrementEdit(true)" />
          </div>
        </div>

      </div>
    </template>

    <template #footer>
      <template v-if="detail">
        <Button
          v-if="detail.variantCombination?.variants"
          :label="storeProduct.getCheckButtonOrder ? 'Cập nhật' : 'Không đủ hàng!'"
          :disabled="!storeProduct.getCheckButtonOrder"
          class="w-full"
          color="primary"
          @handleOnClick="storeCart.updateProductWithOptions(detail, storeCart.quantityEdit, detail.note, detail.productKey, storeCart.tempSelected)"
        />
        <template v-else>
          <Button
            v-if="detail.id"
            :label="storeProduct.getCheckButtonOrder ? 'Cập nhật' : 'Không đủ hàng!'"
            :disabled="!storeProduct.getCheckButtonOrder"
            class="w-full"
            color="primary"
            @handleOnClick="storeCart.updateNormalProduct(detail, storeCart.quantityEdit, detail.note, detail.id)"
          />
        </template>
      </template>
    </template>
  </Popup>
</template>