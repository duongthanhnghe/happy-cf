<script lang="ts" setup>
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useAccountStore } from '@/stores/client/users/useAccountStore';

const { t } = useITranslations()
const store = useCartStore();
const storeAccount = useAccountStore();

</script>
<template>
  <Card v-if="store.allVouchers?.length" class="rd-xl mt-sm shadow-1 mt-ms mb-ms">
    <div class="flex justify-between mb-sm">
      <Text size="md" color="black" weight="semibold" :text="t('cart.text8')" />
      <div v-if="store.selectedVoucher || store.selectedFreeship" class="flex align-center gap-xs">
        Xoá mã: 
        <CartVoucherChoose />
      </div>
    </div>
    
    <CartVoucherMessage />

    <div class="position-relative">
      <div class="shape-loading" v-if="store.loadingAllVouchers">
        <v-progress-circular indeterminate ></v-progress-circular>
      </div>
      <div class="flex gap-sm overflow-auto" v-if="store.allVouchers?.length">
        <CartVoucherList classEl="min-width-300" :classElFreeship="store.shippingEnabled && store.getShippingFee === 0 ? '_hidden':''"/>
      </div>
    </div>

    <div v-if="storeAccount.getUserId" class="mt-md">
      <CartVoucherInput />
    </div>
  </Card>
</template>