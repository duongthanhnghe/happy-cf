<script lang="ts" setup>
import {
  useAccountStore
} from '@/stores/client/users/useAccountStore'

const storeAccount = useAccountStore();

</script>
<template>
<Popup popupId="popup-barcode" v-model="storeAccount.isTogglePopupBarcode" bodyClass="pt-md" popupHeading="Barcode cua ban" variant="modal-center" align="center">
  <template #body>
    <div class="text-color-gray5 text-center mt-xs">Vui long dua ma barcode nay de quet tai cua hang</div>
    <div class="text-center">
      <img :src="storeAccount.getDetailValue?.membership.barcode" alt="barcode" class="mt-lg m-auto" width="450" />
    </div>
  </template>
</Popup>
</template>