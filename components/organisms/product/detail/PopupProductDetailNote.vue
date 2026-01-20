<script lang="ts" setup>
import LabelInput from '@/components/atoms/LabelInput.vue';
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useProductDetailStore } from '@/stores/client/product/useProductDetailStore';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';

const { t } = useITranslations()
const store = useProductDetailStore();
const storeCart = useCartStore();
const storeDisplay = useDisplayStore()

</script>
<template>
  <Popup 
  v-model="store.isTogglePopupNote" 
  variant="modal-center" 
  bodyClass="bg-gray6" 
  :align="storeDisplay.isLaptop ? 'center':'bottom'"
  :popupHeading="storeDisplay.isLaptop ? t('product.detail.text5').text :''"
  >
    <template #body >
        <LabelInput class="weight-medium"/>
        <v-textarea :placeholder="t('product.detail.text6').text" class="mb-0" :rows="5" v-model="storeCart.note" :hideDetails="true"/>
    </template>
    <template #footer >
      <div class="mt-sm">
        <Button color="black" class="w-full" label="Xác nhận" @click.prevent="store.handleTogglePopupNote(false)"/>
      </div>
    </template>
  </Popup>
</template>