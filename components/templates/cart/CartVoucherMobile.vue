<script lang="ts" setup>
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useAccountStore } from '@/stores/client/users/useAccountStore';

const store = useCartStore();
const storeAccount = useAccountStore();

</script>
<template>
  <Popup v-model="store.isTogglePopupVoucher" popupHeading="Voucher giảm giá" bodyClass="bg-gray6" footerFixed align="right">
    <template #body>
      <div v-if="store.allVouchers?.length">
        <div v-if="store.selectedVoucher || store.selectedFreeship" class="mb-md">
          <Text text="Voucher dang ap dung" color="black" size="normal" weight="semibold" class="mb-sm" />
          <div v-if="store.voucherUsage.length > 0" class="flex gap-xs flex-wrap mb-sm">
            <CartVoucherChoose />
          </div>
          <CartVoucherMessage />
        </div>

        <div v-if="storeAccount.getUserId" class="mb-md">
          <CartVoucherInput />
        </div>

        <div class="position-relative">
          <Text text="Voucher đề xuất cho bạn" color="black" size="normal" weight="semibold" class="mb-sm" />
          <div class="shape-loading" v-if="store.loadingAllVouchers">
            <v-progress-circular indeterminate ></v-progress-circular>
          </div>
          <div v-if="store.allVouchers?.length" class="flex flex-direction-column gap-sm">
            <CartVoucherList />
          </div>
        </div>
      </div>
    </template>
    <template #footer>
      <div class="text-center">
        <Button color="black" label="Tiep tuc thanh toan" @click.prevent="store.handleTogglePopupVoucher(false)"/>
      </div>
    </template>
  </Popup>
</template>