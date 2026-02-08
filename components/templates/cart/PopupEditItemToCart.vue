<script lang="ts" setup>
import '@/styles/templates/cart/popup-add-item-to-cart.scss'
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { useITranslations } from '@/composables/shared/itranslation/useITranslations'
import { useFlashSaleDetail } from '@/composables/product/flash-sale/useFlashSaleDetail'
import { computed, watch } from 'vue';
import { useProductDetail } from '@/composables/product/useProductDetail';

const { getFlashSaleDetail, fetchFlashSaleDetail } = useFlashSaleDetail()
const { fetchDetailProduct } = useProductDetail()

const { t } = useITranslations()
const storeProduct = useProductDetailStore();
const storeCart = useCartStore();
const storeDisplay = useDisplayStore()

const detail = computed(() => storeCart.getProductDetailDataEdit);

watch(
  () => storeCart.getPopupState('edit'),
  async (isOpen) => {
    if (!isOpen) return

    if(detail.value?.id) await fetchDetailProduct(detail.value?.id);

    if(detail && storeCart.getProductDetailDataEdit?.flashSale?.id) {
      await fetchFlashSaleDetail(storeCart.getProductDetailDataEdit?.flashSale?.id)
    } 
  }
)

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
          <Image 
            v-if="detail?.image"
            :src="detail?.image"
            :alt="detail?.productName"
            :width="650"
          />
        </div>
        <div class="popup-detail-product-card popup-detail-product-info">
          <div class="popup-detail-product-right">
            <Text size="normal" class="mb-xs" color="black" :text="detail?.productName" />

            <!-- <Text v-if="storeProduct.variantPrice !== undefined && storeProduct.variantPrice !== null" :text="formatCurrency(storeProduct.variantPrice)" color="gray5" class="pb-md"/> -->
            <template v-if="detail">
              <div v-if="detail.flashSale" class="mb-md">
                <client-only>
                <ProductDetailFlashSaleInfo
                  v-if="getFlashSaleDetail"
                  :getFlashSaleDetail="getFlashSaleDetail"
                >
                  <ProductDetailPrice
                    :detail="detail"
                    :variantPrice="storeProduct.variantPrice"
                    :percentDiscount="storeProduct.percentDiscount"
                    isFlashSale
                    :selectedFlashSaleItem="storeProduct.selectedFlashSaleItem"
                  />
                </ProductDetailFlashSaleInfo>
                </client-only>
              </div>
              <ProductDetailPrice
                v-else
                :detail="detail"
                :variantPrice="storeProduct.variantPrice"
                :percentDiscount="storeProduct.percentDiscount"
              />
            </template>

          </div>
          <div class="flex flex-direction-column gap-ms mb-sm pb-md" v-if="detail?.variantCombinations?.length">
            <ProductDetailOptions 
              :variantCombinations="detail.variantCombinations"
              showHeading
            />
          </div>
          <div v-else class="pb-xs"></div>
        </div>

        <div class="popup-detail-product-card pb-md">
          <Text size="normal" class="mb-sm" color="black" :text="t('product.detail.text6')" />

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
          :label="storeProduct.getCheckButtonOrder ? t('product.detail.text10').text : t('product.detail.text9').text"
          :disabled="!storeProduct.getCheckButtonOrder"
          class="w-full"
          color="primary"
          @handleOnClick="storeCart.updateProductWithOptions(detail, storeCart.quantityEdit, detail.note, detail.productKey, storeCart.tempSelected)"
        />
        <template v-else>
          <Button
            v-if="detail.id"
            :label="storeProduct.getCheckButtonOrder ? t('product.detail.text10').text : t('product.detail.text9').text"
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