<script lang="ts" setup>
import '@/styles/templates/cart/cart.scss'
import type { SubmitEventPromise } from 'vuetify';
import { onMounted, onBeforeUnmount } from 'vue'
import { showWarning } from '@/utils/toast'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { ROUTES } from '@/shared/constants/routes';
import { usePaymentStatusStore } from '@/stores/shared/usePaymentStatusStore'
import { useLocationStore } from '@/stores/shared/useLocationStore';
import { useEventBus } from "@/composables/voucher/useEventBus";
import { useLocationWatchers } from '@/composables/shared/location/useLocationWatchers';
import { useCartLocationWatchers } from '@/composables/cart/useCartLocationWatchers';
import { useDisplayStore } from '@/stores/shared/useDisplayStore'

definePageMeta({
  middleware: ROUTES.PUBLIC.CART.middleware,
  layout: ROUTES.PUBLIC.CART.layout,
  headerTypeLeft: ROUTES.PUBLIC.ORDER_TRACKING.headerTypeLeft,
})

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

onMounted(async () => {
  if (store.getCartListItem.length > 0) {
    await store.fetchProductCart();
    
    await storeLocation.fetchProvincesStore();
    if (storeAccount.getUserId) {
      await store.handleGetDefaultAddress();
    }
    if (storePaymentStatus.getListData.length === 0) {
      storePaymentStatus.fetchPaymentStatusStore();
    }
    store.handleVoucherReset;
    // eventBus.on('voucher:reset', store.handleVoucherReset);
  }
});

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

  <div class="bg-gray6 cart-body">
    <div class="container">
      <BreadcrumbDefault />

      <v-form v-if="store.getCartListItem && store.getCartListItem.length > 0" validate-on="submit lazy" @submit.prevent="submitOrder">
        <!-- LIST PRODUCT -->
        <div class="rd-lg overflow-hidden">
          <Text text="Gio hang" color="black" size="md" weight="semibold" class="mb-xs" />
          <div class="flex flex-direction-column gap-xs">
            <CartItemTemplate1 v-for="(item, index) in store.getCartListItem" :key="index" :item="item" />
          </div>
        </div>

        <!-- LABEL POINT -->
        <template v-if="store.getTotalPriceDiscount != 0 && storeAccount.getUserId">
          <CartPointInfoLabel :getTotalPoint="store.getTotalPoint"/>
        </template>
        
        <!-- PERSION INFO -->
        <CartPersonInfo :userId="storeAccount.getUserId" />
      
        <!-- POINT AND VOUCHER -->
        <template v-if="!storeDisplay.isMobileTable">
          <CartPointPC :userId="storeAccount.getUserId" :balancePoint="storeAccount.getDetailValue.membership.balancePoint"/>
          <CartVoucherPC />
        </template>

        <!-- PAYMENT INFO -->
        <CartPaymentInfo :userId="storeAccount.getUserId" :balancePoint="storeAccount.getDetailValue.membership.balancePoint"/>
      </v-form>
      <div v-else class="text-center">
        <Heading weight="semibold" class="text-center">Gio hang</Heading>
        <div class="mt-sm mb-sm">Khong co san pham trong gio hang</div>
        <NuxtLink :to="{ path: ROUTES.PUBLIC.ORDER.path }">
          <Button color="black" label="Dat hang ngay" />
        </NuxtLink>
      </div>
    </div>
  </div>

  <template v-if="storeDisplay.isMobileTable">
    <!-- POPUP USE POINT -->
    <CartPointMobile :userId="storeAccount.getUserId" :balancePoint="storeAccount.getDetailValue.membership.balancePoint" />
    <!-- POPUP CHOOSE VOUCHER -->
    <CartVoucherMobile />
  </template>

  <PopupManageAddress v-if="storeAccount.getUserId" :idChoose="store.getIdAddressChoose"/>
</template>