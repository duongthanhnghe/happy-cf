<script setup>
import { watch } from 'vue'
import {
  useProductStore
} from '@/stores/product/useProductOrderStore'
import {
  useCartStore
} from '@/stores/product/useCartOrderStore'
import { formatCurrency } from '~/utils/global';
import '@/styles/templates/cart/popup-add-item-to-cart.scss'
import {
  useDisplayStore
} from '@/stores/shared/useDisplayStore'

//store
const storeProduct = useProductStore();
const storeCart = useCartStore();
const storeDisplay = useDisplayStore()

//method
const setTogglePopupEdit = () => {
  storeProduct.togglePopup('edit', false);
}

const handleChangeVariant = (idOption, idVariant, optionName, variantName, variantPrice) => {
  storeCart.setSelectedOptionsData(idOption, idVariant, optionName, variantName, variantPrice);
  storeProduct.priceOptions = storeCart.getSelectedOptionsData.reduce(
    (total, item) => total + item.variantPrice,
    0
  );
  storeProduct.calcTotalPrice("edit");
};

watch(() => storeProduct.getProductDetailDataEdit?.selectedOptionsPush, (newValue) => {
  if (newValue) {
    storeProduct.getProductDetailDataEdit.selectedOptionsPush.forEach(opt => {
      const option = storeProduct.getProductDetailDataEdit.options.find(o => o.name === opt.optionName)
      const variant = option?.variants.find(v => v.name === opt.variantName)
      if (option && variant) {
        storeCart.selectedOptionsData[option.id] = variant.id
      }
    })
  }
}, { immediate: true })
</script>

<template>
  <Popup :children="true" :variant="storeDisplay.isMobileTable ? 'modal-center':'modal-right'" align="bottom" popupId="popup-edit" :modelValue="storeProduct.getPopupState('edit')" :popupHeading="storeDisplay.isMobileTable ? '':'Sua san pham'" bodyClass="pt-0 pl-0 pr-0 bg-gray2" @update:modelValue="setTogglePopupEdit">
    <template #body v-if="storeProduct.getProductDetailDataEdit">
      <div class="popup-detail-product">
        <div class="popup-detail-product-image">
          <img :src="storeProduct.getProductDetailDataEdit.image" :alt="storeProduct.getProductDetailDataEdit.productName" />
        </div>
        <div class="popup-detail-product-card popup-detail-product-info">
          <div class="popup-detail-product-right">
            <Heading tag="div" size="lg" weight="bold" class="black mb-sm">
              {{ storeProduct.getProductDetailDataEdit.productName }}
            </Heading>
            <div class="text-color-gray5 weight-semibold" v-if="storeProduct.getProductDetailDataEdit?.finalPriceDiscounts && storeProduct.getProductDetailDataEdit?.finalPriceDiscounts != undefined">
              {{ formatCurrency(parseInt(storeProduct.getProductDetailDataEdit?.finalPriceDiscounts)) }}
            </div>
            <div class="text-color-gray5 weight-semibold" v-else>
              {{ formatCurrency(parseInt(storeProduct.getProductDetailDataEdit?.priceDiscounts)) }}
            </div>
            <div class="mt-md text-size-xs pb-ms">
              {{ storeProduct.getProductDetailDataEdit.summaryContent }}
            </div>
          </div>
        </div>
        <template v-if="storeProduct.getProductDetailDataEdit?.options && storeProduct.getProductDetailDataEdit?.options.length > 0">
          <v-radio-group
            hide-details
            v-for="item in storeProduct.getProductDetailDataEdit?.options"
            :key="item.id"
            v-model="storeCart.tempSelected[item.id]"
            :name="`radio-group-${item.id}`"
            class="mt-sm mb-sm popup-detail-product-card"
            @update:modelValue="(val) => {
              const variant = item.variants.find(v => v.id === val)
              if (variant) {
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
          <v-textarea class="mb-0" :rows="5" v-model="storeProduct.getProductDetailDataEdit.note" :value="storeProduct.getProductDetailDataEdit.note"/>

          <div class="flex justify-center">
            <Button color="gray" icon="check_indeterminate_small" @click="storeProduct.inDecrementEdit(false)" />
            <Button :disabled="true" :border="false" color="secondary" class="popup-detail-product-quantity pd-0 text-size-large weight-medium" :label="storeProduct.getQuantityEdit"/>
            <Button color="gray" icon="add" @click="storeProduct.inDecrementEdit(true)" />
          </div>
        </div>

      </div>
    </template>

    <template #footer v-if="storeProduct.getProductDetailDataEdit">
      <div class="portal-popup-footer">
      <Button
        v-if="storeProduct.getProductDetailDataEdit?.finalPriceDiscounts && storeProduct.getProductDetailDataEdit?.finalPriceDiscounts != undefined"
        :label="'Cập nhật - ' + formatCurrency(parseInt(storeProduct.getPriceTotal))"
        class="w-full"
        color="primary"
        @handleOnClick="storeCart.updateProductWithOptions(storeProduct.getProductDetailDataEdit, storeProduct.getQuantityEdit, storeProduct.getProductDetailDataEdit.note, storeProduct.getProductDetailDataEdit.productKey)"
      />
      <template v-else>
      <Button
        v-if="storeProduct.getProductDetailDataEdit.id"
        :label="'Cập nhật - ' + formatCurrency(parseInt(storeProduct.getPriceTotal))"
        class="w-full"
        color="primary"
        @handleOnClick="storeCart.updateNormalProduct(storeProduct.getProductDetailDataEdit, storeProduct.getQuantityEdit, storeProduct.getProductDetailDataEdit.note, storeProduct.getProductDetailDataEdit.id)"
      />
      </template>
      </div>
    </template>
  </Popup>
</template>