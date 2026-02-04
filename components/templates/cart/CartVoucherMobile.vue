<script lang="ts" setup>
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useAccountStore } from '@/stores/client/users/useAccountStore';

const { t } = useITranslations()
const store = useCartStore();
const storeAccount = useAccountStore();
const props = defineProps<{ 
  stackable: boolean,
}>()

</script>
<template>
  <Popup v-model="store.isTogglePopupVoucher" :popupHeading="t('cart.text8').text" bodyClass="bg-gray6" footerFixed align="right">
    <template #body>
      <div v-if="store.allVouchers?.length > 0">
        <Text v-if="props.stackable" :text="t('cart.text21')" color="danger" class="text-italic mb-sm" />

        <div v-if="store.selectedVoucher || store.selectedFreeship" class="mb-md">
          <Text text="Voucher đang áp dụng" color="black" size="normal" weight="semibold" class="mb-sm" />
          <div v-if="store.voucherUsage.length > 0" class="flex gap-xs flex-wrap mb-sm">
            <CartVoucherChoose />
          </div>
          <CartVoucherMessage />
        </div>

        <div v-if="storeAccount.getUserId" class="mb-md">
          <CartVoucherInput :stackable="props.stackable" />
        </div>

        <div class="position-relative">
          <Text text="Voucher đề xuất cho bạn" color="black" size="normal" weight="semibold" class="mb-sm" />
          <div class="shape-loading" v-if="store.loadingAllVouchers">
            <v-progress-circular indeterminate ></v-progress-circular>
          </div>
          <div v-if="store.allVouchers?.length > 0" class="flex flex-direction-column gap-sm">
            <CartVoucherList :classElFreeship="store.shippingEnabled && store.getShippingFee === 0 ? '_hidden':''" :stackable="props.stackable" />
          </div>
        </div>
      </div>
      <NoData v-else text="Không có voucher nào" />
    </template>
    <template #footer>
      <div class="text-center">
        <Button color="black" :label="t('cart.text12').text" @click.prevent="store.handleTogglePopupVoucher(false)"/>
      </div>
    </template>
  </Popup>
</template>