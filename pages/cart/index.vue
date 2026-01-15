<script lang="ts" setup>
import type { SubmitEventPromise } from 'vuetify';
import { onBeforeUnmount, onMounted, watch } from 'vue'
import { showWarning } from '@/utils/toast'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { ROUTES } from '@/shared/constants/routes';
import { usePaymentStatusStore } from '@/stores/client/order/usePaymentStatusStore'
import { useLocationStore } from '@/stores/shared/useLocationStore';
import { useEventBus } from "@/composables/voucher/useEventBus";
import { useLocationWatchers } from '@/composables/shared/location/useLocationWatchers';
import { useCartLocationWatchers } from '@/composables/cart/useCartLocationWatchers';
import { useDisplayStore } from '@/stores/shared/useDisplayStore'
import { useITranslations } from '@/composables/shared/itranslation/useITranslations';

definePageMeta({
  middleware: ROUTES.PUBLIC.CART.middleware,
  showBreadcrumb: ROUTES.PUBLIC.CART.showBreadcrumb,
  layout: ROUTES.PUBLIC.CART.layout,
  containerClass: 'bg-gray6'
})

const { t } = useITranslations()
const store = useCartStore();
const storeAccount = useAccountStore();
const storePaymentStatus = usePaymentStatusStore();
const storeLocation = useLocationStore();
const eventBus = useEventBus();
const storeDisplay = useDisplayStore()

const submitOrder = async (event: SubmitEventPromise) => {
  const results = await event;
  if (!results.valid) {
    showWarning('Vui lòng chọn đầy đủ thông tin!');
    return;
  }
  store.submitOrder();
};

useLocationWatchers(storeLocation);
useCartLocationWatchers(storeLocation, store);

watch(
  () => store.getCartListItem,
  async (items) => {
    if (!items.length) return
    store.handleVoucherReset();
    // eventBus.on('voucher:reset', store.handleVoucherReset);
  },
  { deep: true }
)

onMounted(async () => {
  if (!store.cartListItem) return

  if (store.cartListItem.length > 0 && store.getCartListItem?.length === 0) await store.fetchProductCart()
  await storeLocation.fetchProvincesStore()
  if(storeAccount.getUserId) store.handleGetDefaultAddress()

  if (storePaymentStatus.getListData.length === 0) {
    storePaymentStatus.fetchPaymentStatusStore()
  }
})

onBeforeUnmount(() => {
  store.selectedFreeship = null;
  store.selectedVoucher = null;
  store.discountVoucher = 0;
  store.discountVoucherFreeship = 0;
  store.messageVoucher = '';
  store.voucherUsage = [];
  store.activeFreeshipVoucher = null;
  // storeLocation.resetLocation();
  store.handleVoucherReset;
  // eventBus.off('voucher:reset', store.handleVoucherReset);
  store.isTogglePopupVoucher = false;
  store.isTogglePopupPoint = false;
});

</script>
<template>
  <client-only>
  <div class="pb-section">
    <div class="container">
      <LoadingData v-if="store.loadingCartProduct && !store.getCartListItem" />
      <v-form v-else-if="store.getCartListItem && store.getCartListItem.length > 0" validate-on="submit lazy" @submit.prevent="submitOrder">
        <!-- LIST PRODUCT -->
        <div class="rd-lg overflow-hidden">
          <div class="flex justify-between align-center mb-xs">
            <Text :text="t('cart.text1')" color="black" size="md" weight="semibold" />
            <Text text="Xoá tất cả" color="gray5" class="cursor-pointer" @click.prevent="store.handleDeleteCartAll" />
          </div>
          <div class="flex flex-direction-column gap-xs">
            <CartItemTemplate1 v-for="(item, index) in store.getCartListItem" :key="index" :item="item" />
          </div>
        </div>

        <!-- LABEL POINT -->
        <template v-if="store.getTotalPriceDiscount != 0">
          <CartPointInfoLabel :getTotalPoint="store.getTotalPoint" :userId="storeAccount.getUserId"/>
        </template>
        
        <!-- PERSION INFO -->
        <CartPersonInfo :userId="storeAccount.getUserId" />
      
        <!-- POINT AND VOUCHER -->
        <template v-if="!storeDisplay.isMobileTable">
          <CartPointPC v-if="storeAccount.getUserId" :userId="storeAccount.getUserId" :balancePoint="storeAccount.getDetailValue?.membership.balancePoint"/>
          <CartVoucherPC />
        </template>

        <!-- PAYMENT INFO -->
        <CartPaymentInfo :userId="storeAccount.getUserId" :balancePoint="storeAccount.getDetailValue?.membership?.balancePoint || 0"/>
      </v-form>
      <div v-else class="text-center">
        <NoData :text="t('cart.text17').text" class="mb-sm"/>
        <NuxtLink :to="{ path: ROUTES.PUBLIC.ORDER.path }" >
          <Button color="black" :label="t('cart.text18').text" />
        </NuxtLink>
      </div>
    </div>
  </div>

  <template v-if="storeDisplay.isMobileTable">
    <!-- POPUP USE POINT -->
    <CartPointMobile v-if="storeAccount.getUserId && storeAccount.getDetailValue?.membership.balancePoint && storeAccount.getPendingReward?.totalPendingPoints" :userId="storeAccount.getUserId" :balancePoint="storeAccount.getDetailValue.membership.balancePoint" :totalPendingPoints="storeAccount.getPendingReward?.totalPendingPoints" />
    <!-- POPUP CHOOSE VOUCHER -->
    <CartVoucherMobile />
  </template>

  <PopupManageAddress v-if="storeAccount.getUserId" :idChoose="store.getIdAddressChoose"/>

  </client-only>
</template>