<script lang="ts" setup>
import { useAccountStore } from '@/stores/client/users/useAccountStore'

const storeAccount = useAccountStore();

</script>
<template>
  <Popup v-model="storeAccount.isTogglePopupBarcode" bodyClass="pt-md" popupHeading="Barcode của bạn" variant="modal-center" align="center">
    <template #body>
      <div class="text-color-gray5 text-center mt-xs">Đưa mã barcode này cho nhân viên để được tích điểm khi mua hàng tại cửa hàng</div>
      <div class="text-center">
        <img :src="storeAccount.getDetailValue?.membership.barcode" alt="barcode" class="mt-lg m-auto" width="450" />
      </div>
    </template>
  </Popup>
</template>