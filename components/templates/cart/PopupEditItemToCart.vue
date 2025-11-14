<script lang="ts" setup>
import '@/styles/templates/cart/popup-add-item-to-cart.scss'
import { computed, watch } from 'vue'
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { formatCurrency } from '@/utils/global';
import { useDisplayStore } from '@/stores/shared/useDisplayStore'

const storeProduct = useProductDetailStore();
const storeCart = useCartStore();
const storeDisplay = useDisplayStore()

const handleChangeVariant = (idOption: string, idVariant: string, optionName: string, variantName: string, variantPrice: number) => {
  storeCart.setSelectedOptionsData(idOption, idVariant, optionName, variantName, variantPrice);
  storeProduct.priceOptions = storeCart.getSelectedOptionsData.reduce(
    (total, item) => total + item.variantPrice,
    0
  );
  storeCart.calcTotalPrice("edit");
};

watch(() => storeCart.getProductDetailDataEdit?.selectedOptionsPush, (newValue) => {
  if (newValue && storeCart.getProductDetailDataEdit?.selectedOptionsPush) {
    storeCart.getProductDetailDataEdit?.selectedOptionsPush.forEach(opt => {
      const option = storeCart.getProductDetailDataEdit?.options?.find(o => o.name === opt.optionName)
      const variant = option?.variants.find(v => v.name === opt.variantName)
      if (option && variant) {
        storeCart.selectedOptionsData[option.id] = variant.id
      }
    })
  }
}, { immediate: true })

const detail = computed(() => storeCart.getProductDetailDataEdit);
const detailProduct = computed(() => storeProduct.getDetailProduct);

</script>

<template>
  <Popup :children="storeCart.isTogglePopup ? true: false" :variant="storeDisplay.isMobileTable ? 'modal-center':'modal-right'" align="bottom" popupId="popup-edit" :modelValue="storeCart.getPopupState('edit')" :popupHeading="storeDisplay.isMobileTable ? '':'Sua san pham'" bodyClass="pt-0 pl-0 pr-0 bg-gray2" @update:modelValue="storeCart.togglePopup('edit', false)">
    <template #body v-if="detail">
      <div class="popup-detail-product">
        <div class="popup-detail-product-image">
          <img :src="detailProduct?.image" :alt="detailProduct?.productName" />
        </div>
        <div class="popup-detail-product-card popup-detail-product-info">
          <div class="popup-detail-product-right">
            <Heading tag="div" size="lg" weight="bold" class="black mb-sm">
              {{ detailProduct?.productName }}
            </Heading>
            <div class="text-color-gray5 weight-semibold" v-if="detail.finalPriceDiscounts && detail.finalPriceDiscounts != undefined">
              {{ formatCurrency(detail.finalPriceDiscounts) }}
            </div>
            <div class="text-color-gray5 weight-semibold" v-else>
              {{ formatCurrency(detail.priceDiscounts) }}
            </div>
            <div class="mt-md text-size-xs pb-ms">
              {{ detailProduct?.summaryContent }}
            </div>
          </div>
        </div>
        <template v-if="detailProduct?.options && detailProduct?.options?.length > 0">
          <v-radio-group
            hide-details
            v-for="item in detail?.options"
            :key="item.id"
            v-model="storeCart.tempSelected[item.id]"
            :name="`radio-group-${item.id}`"
            class="mt-sm mb-sm popup-detail-product-card"
            @update:modelValue="(val) => {
              const variant = item.variants.find(v => v.id === val)
              if (variant && val && variant.priceModifier) {
                handleChangeVariant(item.id, val, item.name, variant.name, variant.priceModifier)
              }
            }"
          >
            <Heading tag="div" size="md" weight="semibold" class="black pt-sm pl-ms pr-ms">
              {{ item.name }} - {{ item.id }}
            </Heading>
            <v-radio
              v-for="variant in item.variants"
              class="popup-detail-product-variant"
              rel="js-popup-detail-variant-item"
              :value="variant.id"
            >
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
        <div v-else class="mt-sm"></div>
        
        <div class="popup-detail-product-card pb-md">
          <Heading tag="div" size="md" weight="semibold" class="black mb-sm">
            Them luu y cho quan
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

    <template #footer v-if="detail">
      <div class="portal-popup-footer">
      <Button
        v-if="detail.finalPriceDiscounts && detail.finalPriceDiscounts != undefined"
        :label="'Cập nhật - ' + formatCurrency(storeCart.priceTotalEdit)"
        class="w-full"
        color="primary"
        @handleOnClick="storeCart.updateProductWithOptions(detailProduct, storeCart.quantityEdit, detail.note, detail.productKey)"
      />
      <template v-else>
        <Button
          v-if="detail.id"
          :label="'Cập nhật - ' + formatCurrency(storeCart.priceTotalEdit)"
          class="w-full"
          color="primary"
          @handleOnClick="storeCart.updateNormalProduct(detailProduct, storeCart.quantityEdit, detail.note, detail.id)"
        />
      </template>
      </div>
    </template>
  </Popup>
</template>