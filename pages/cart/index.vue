<script lang="ts" setup>
import '@/styles/templates/cart/popup-cart.scss'
import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
import type { SubmitEventPromise } from 'vuetify';
import { formatCurrency } from '@/utils/global'
import { showWarning } from '@/utils/toast'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore'
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { ROUTES } from '@/shared/constants/routes';
import { usePaymentStatusStore } from '@/stores/shared/usePaymentStatusStore'
import { nullRules, phoneRules } from '@/utils/validation'
import { useLocationStore } from '@/stores/shared/useLocationStore';
import { VOUCHER_TYPE } from '@/shared/constants/voucher-type';
import { useEventBus } from "@/composables/voucher/useEventBus";
import { useCartVoucherHandlers } from '@/composables/cart/useCartVoucherHandlers';
import { useCartLocationWatchers } from '@/composables/cart/useCartLocationWatchers';

definePageMeta({
  headerTypeLeft: ROUTES.PUBLIC.ORDER_TRACKING.headerTypeLeft,
})

const store = useCartStore();
const storeAddress = useAddressesManageStore();
const storeAccount = useAccountStore();
const storePaymentStatus = usePaymentStatusStore();
const storeLocation = useLocationStore();
const eventBus = useEventBus();

const selectedFreeship = ref<string | null>(null);
const selectedVoucher = ref<string | null>(null);
const voucherCode = ref<string>('');

const submitOrder = async (event: SubmitEventPromise) => {
  const results = await event;
  if (!results.valid) {
    showWarning('Vui lòng chọn đầy đủ thông tin!');
    return;
  }
  store.submitOrder();
};

// Voucher handlers
const { removeVoucher, handleVoucherReset, handleApplyVoucherInput } = useCartVoucherHandlers(
  store,
  selectedFreeship,
  selectedVoucher,
  voucherCode
);

// Location watchers
useCartLocationWatchers(storeLocation, store);

// Voucher selection watcher
watch(
  [selectedVoucher, selectedFreeship],
  ([newVoucher, newFreeship], [oldVoucher, oldFreeship]) => {
    if (newVoucher && newVoucher !== oldVoucher) {
      store.messageVoucher = '';
      if (oldVoucher) {
        store.voucherUsage = store.voucherUsage.filter(v => v.code !== oldVoucher);
      }
      store.applyVoucher(newVoucher);
    }

    if (newFreeship && newFreeship !== oldFreeship) {
      if (oldFreeship) {
        store.voucherUsage = store.voucherUsage.filter(v => v.code !== oldFreeship);
      }
      store.applyVoucher(newFreeship);
    }
  }
);

onMounted(async () => {
  if (store.getCartListItem.length > 0) {
    await store.fetchProductCart();
    
    await storeLocation.fetchProvincesStore();
    if (storeAccount.getDetailValue?.id) {
      await store.handleGetDefaultAddress();
    }
    if (storePaymentStatus.getListData.length === 0) {
      storePaymentStatus.fetchPaymentStatusStore();
    }
    eventBus.on('voucher:reset', handleVoucherReset);
  }
});

onBeforeUnmount(() => {
  selectedFreeship.value = null;
  selectedVoucher.value = null;
  store.discountVoucher = 0;
  store.discountVoucherFreeship = 0;
  store.messageVoucher = '';
  store.voucherUsage = [];
  store.activeFreeshipVoucher = null;
  storeLocation.resetLocation();
  eventBus.off('voucher:reset', handleVoucherReset);
});

// import '@/styles/templates/cart/popup-cart.scss'
// import { ref, watch, onMounted, onBeforeUnmount } from 'vue'
// import type { SubmitEventPromise } from 'vuetify';
// import { formatCurrency } from '@/utils/global'
// import { showWarning } from '@/utils/toast'
// import { useCartStore } from '@/stores/client/product/useCartOrderStore'
// import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore'
// import { useAccountStore } from '@/stores/client/users/useAccountStore';
// import { ROUTES } from '@/shared/constants/routes';
// import { usePaymentStatusStore } from '@/stores/shared/usePaymentStatusStore'
// import { nullRules, phoneRules } from '@/utils/validation'
// import { useLocationStore } from '@/stores/shared/useLocationStore';
// import { VOUCHER_TYPE } from '@/shared/constants/voucher-type';
// import { useEventBus } from "@/composables/voucher/useEventBus";

// definePageMeta({
//   headerTypeLeft: ROUTES.PUBLIC.ORDER_TRACKING.headerTypeLeft,
// })

// const store = useCartStore();
// const storeAddress = useAddressesManageStore();
// const storeAccount = useAccountStore();
// const storePaymentStatus = usePaymentStatusStore();
// const storeLocation = useLocationStore();
// const eventBus = useEventBus();

// const selectedFreeship = ref<string| null>(null);
// const selectedVoucher = ref<string | null>(null);
// const voucherCode = ref<string>('');

// const submitOrder = async (event: SubmitEventPromise) => {
//   const results = await event
//   if (!results.valid) {
//     showWarning('Vui lòng chọn đầy đủ thông tin!');
//     return
//   }
//   store.submitOrder()
// }

// const removeVoucher = (code: string, type: any) => {
//   if(type === VOUCHER_TYPE.freeship.type){
//     selectedFreeship.value = null;
//     store.discountVoucherFreeship = 0;
//     store.activeFreeshipVoucher = null;
//   } else {
//     selectedVoucher.value = null;
//     store.discountVoucher = 0;
//     store.messageVoucher = '';
//   }

//   store.voucherUsage = store.voucherUsage.filter(v => v.code !== code);
//   store.handleCalcTotalPriceCurrent();
// }

// const handleVoucherReset = (data: {resetFreeship: boolean;resetVoucher: boolean;}) => {
//   if (data.resetFreeship) selectedFreeship.value = null;
//   if (data.resetVoucher) selectedVoucher.value = null;
// };

// const handleApplyVoucherInput = async () => {
//   if (!voucherCode.value) return;

//   await store.applyVoucher(voucherCode.value);

//   const appliedVoucher = store.voucherUsage.find(v => v.code === voucherCode.value);
//   if (appliedVoucher) {
//     if (appliedVoucher.type === VOUCHER_TYPE.freeship.type) {
//       selectedFreeship.value = appliedVoucher.code;
//     } else {
//       selectedVoucher.value = appliedVoucher.code;
//     }
//   }

//   voucherCode.value = '';
// };


// watch( // chon voucher
//   [selectedVoucher, selectedFreeship],
//   ([newVoucher, newFreeship], [oldVoucher, oldFreeship]) => {
//     if (newVoucher && newVoucher !== oldVoucher) {
//       store.messageVoucher = '';
//       if(oldVoucher) store.voucherUsage = store.voucherUsage.filter(v => v.code !== oldVoucher);
//       store.applyVoucher(newVoucher);
//     }

//     if (newFreeship && newFreeship !== oldFreeship) {
//       if(oldFreeship) store.voucherUsage = store.voucherUsage.filter(v => v.code !== oldFreeship);
//       store.applyVoucher(newFreeship);
//     }
//   }
// );

// watch(() => storeLocation.selectedProvince, async (newVal) => {
//   if (storeLocation.isSetting) return
  
//   if (newVal) {
//     await storeLocation.fetchDistrictsStore(newVal)
//     storeLocation.selectedDistrict = null
//     storeLocation.selectedWard = null
//   } else {
//     storeLocation.districts = []
//     storeLocation.wards = []
//   }
// })

// watch(() => storeLocation.selectedDistrict, async (newVal) => {
//   if (storeLocation.isSetting) return
  
//   if (newVal) {
//     await storeLocation.fetchWardsStore(newVal)
//     storeLocation.selectedWard = null
//   } else {
//     storeLocation.wards = []
//   }
// })

// watch(
//   [() => storeLocation.selectedWard, () => store.cartListItem],
//   async ([newWard, newCart]) => {
//     if (newWard && newCart.length > 0) {
//       await store.handleGetFee()
//     } else {
//       store.shippingFee = 0
//     }
//   },
//   { immediate: true, deep: true }
// )

// onMounted(async () => {
//   if(store.getCartListItem.length > 0) {
//     await store.fetchProductCart();
    
//     await storeLocation.fetchProvincesStore()
//     if(storeAccount.getDetailValue?.id) await store.handleGetDefaultAddress()
//     if(storePaymentStatus.getListData.length === 0) storePaymentStatus.fetchPaymentStatusStore()
//     eventBus.on('voucher:reset', handleVoucherReset);
//   } 
// })

// onBeforeUnmount(() => {
//   selectedFreeship.value = null
//   selectedVoucher.value = null
//   store.discountVoucher = 0;
//   store.discountVoucherFreeship = 0;
//   store.messageVoucher = '';
//   store.voucherUsage = [];
//   store.activeFreeshipVoucher = null;
//   storeLocation.resetLocation
//   eventBus.off('voucher:reset', handleVoucherReset);
// })

</script>
<template>

<div class="bg-gray2">
  <div class="container pb-section">
    <BreadcrumbDefault />

    <v-form v-if="store.getCartListItem && store.getCartListItem.length > 0" validate-on="submit lazy" @submit.prevent="submitOrder">
      <div>
        <div class="rd-lg overflow-hidden">
          <Heading tag="div" size="md" weight="semibold" class="popup-cart-card flex justify-between pb-0 mb-0 black">
            San pham da chon
            <slot>
            <NuxtLink :to="{ path: ROUTES.PUBLIC.ORDER.path }" @click="store.isTogglePopup = false">
              <Button tag="div" size="xs" color="secondary" icon="keyboard_arrow_right"/>
            </NuxtLink>
            </slot>
          </Heading>
          <CartItemTemplate1 v-for="(item, index) in store.getCartListItem" :key="index" :item="item" />
        </div>

        <div v-if="store.getTotalPriceDiscount != 0" class="card-sm bg-white flex justify-between mt-ms">
          {{ storeAccount.getDetailValue?.id ? 'Tang diem tuy lich':'Dang nhap de tich diem' }}
          <span class="flex gap-xs weight-semibold">
            <Button size="xs" color="secondary" icon="diamond_shine"/>
            {{ store.getTotalPoint }}
          </span>
        </div>
        
        <div class="card-sm bg-white mt-ms mb-ms pb-0">
          <Heading tag="div" size="md" weight="semibold" class="flex justify-between black mb-sm">
            Thông tin đặt hàng
            <slot v-if="storeAccount.getDetailValue?.id">
            <Button  @click.prevent="storeAddress.handleTogglePopupList(true,true)" size="xs" color="secondary" icon="keyboard_arrow_right"/>
            </slot>
          </Heading>
          <div class="popup-cart-information row row-xs">
            <div class="col-6">
              <LabelInput label="Giờ lấy hang" required/>
              <v-text-field type="time" v-model="store.informationOrder.time" required :rules="store.timeRules" variant="outlined" />
            </div>
            <div class="col-6">
              <LabelInput label="Họ và tên" required/>
              <v-text-field type="text" required v-model="store.informationOrder.fullname" :rules="nullRules" variant="outlined" />
            </div>
            <div class="col-6">
              <LabelInput label="Số điện thoại" required/>
              <v-text-field type="tel" required v-model="store.informationOrder.phone" :rules="phoneRules" maxlength="11" variant="outlined" />
            </div>
            <div class="col-6">
              <LabelInput label="Toà nhà, số nhà, tên đường" required/>
              <v-text-field type="text" required v-model="store.informationOrder.address" :rules="nullRules" variant="outlined" />
            </div>
            <div class="col-4">
              <LabelInput label="Thành phố" required/>
              <v-autocomplete
                v-model="storeLocation.selectedProvince"
                  label="Chọn thành phố"
                  :items="storeLocation.getListProvinces ?? []"
                  item-title="PROVINCE_NAME"
                  item-value="PROVINCE_ID"
                  variant="outlined"
                  :rules="nullRules"
                />
            </div>
            <div class="col-4">
              <LabelInput label="Quan huyen" required/>
               <v-autocomplete
                v-model="storeLocation.selectedDistrict"
                  label="Chọn quan huyen"
                  :items="storeLocation.getListDistricts ?? []"
                  item-title="DISTRICT_NAME"
                  item-value="DISTRICT_ID"
                  variant="outlined"
                  :rules="nullRules"
                />
            </div>
            <div class="col-4">
              <LabelInput label="Phuong xa" required/>
              <v-autocomplete
                v-model="storeLocation.selectedWard"
                  label="Chọn phuong xa"
                  :items="storeLocation.getListWards ?? []"
                  item-title="WARDS_NAME"
                  item-value="WARDS_ID"
                  variant="outlined"
                  :rules="nullRules"
                />
            </div>
          </div>

          <Heading tag="div" size="md" weight="semibold" class="black mb-sm">
            Thanh toan
          </Heading>
          <v-radio-group inline v-model="store.paymentSelected" class="payment-template1-group" nameRadio="namePayment">
            <PaymentItemTemplate1 v-for="(item, index) in storePaymentStatus.getListData" :key="index" :item="item" />
          </v-radio-group>

          <Heading tag="div" size="md" weight="semibold" class="black mb-sm">
            Ghi chu
          </Heading>
          <v-textarea class="mb-0" :rows="5" v-model="store.informationOrder.note" variant="outlined" />
        </div>

        <div v-if="storeAccount.getDetailValue?.id" class="card-sm bg-white mt-ms mb-ms">
          <Heading tag="div" size="md" weight="semibold" class="black mb-sm">
            Su dung diem <span>(Ban dang co {{ storeAccount.getDetailValue.membership.balancePoint }})</span>
          </Heading>
          <div class="flex gap-sm">
            <v-text-field type="number" placeholder="Nhập số điểm" v-model="store.usedPointOrder.pointInput" variant="outlined" hide-details/>
            <Button @click.prevent="store.handleCheckPoint()" color="black" label="Ap dung" :disabled="store.usedPointOrder.pointInput == 0" />
          </div>
        </div>


        <div v-if="store.allVouchers?.length" class="card-sm bg-white mt-ms mb-ms">
          <div class="flex justify-between mb-sm">
            <Heading tag="div" size="md" weight="semibold" class="black">
              Voucher giảm giá
            </Heading>
            <div v-if="selectedVoucher || selectedFreeship" class="flex align-center gap-xs">
              Xoá mã: 

              <template v-if="store.voucherUsage.length > 0">
                <Button
                  v-for="(voucherUsage, index) in store.voucherUsage"
                  color="secondary" size="sm" class="pl-sm pr-sm" @click.prevent="removeVoucher(voucherUsage.code, voucherUsage.type);" :label="voucherUsage.code">
                  <MaterialIcon class="ml-xs" name="close"/>
                </Button>
              </template>
            </div>
          </div>
          

          <div v-if="store.messageVoucher" v-html="store.messageVoucher" class="text-color-green">
          </div>

          <div class="position-relative">
            <div class="shape-loading" v-if="store.loadingAllVouchers">
              <v-progress-circular indeterminate ></v-progress-circular>
            </div>
            <div class="flex gap-sm overflow-auto" v-if="store.allVouchers?.length">
              <VoucherItemTemplate1
                v-for="(voucher, index) in store.allVouchers.filter(v => v.type === VOUCHER_TYPE.freeship.type)"
                :key="'freeship-' + index"
                :item="voucher"
                action
                v-model="selectedFreeship"
              />
              <VoucherItemTemplate1
                v-for="(voucher, index) in store.allVouchers.filter(v => v.type !== VOUCHER_TYPE.freeship.type)"
                :key="'other-' + index"
                :item="voucher"
                action
                v-model="selectedVoucher"
              />
            </div>
          </div>

           <div v-if="storeAccount.getDetailValue?.id" class="flex gap-sm mt-md">
            <v-text-field type="text" placeholder="Nhập mã voucher" v-model="voucherCode" variant="outlined" hide-details/>
            <Button @click.prevent="handleApplyVoucherInput()" color="black" label="Ap dung" :disabled="!voucherCode" />
          </div>
        </div>

        <div class="card-sm bg-white mt-ms">
          <div class="popup-cart-footer-item">
            <Heading tag="div" size="md" weight="normal">Thanh tien <span class="text-size-base text-color-green">(Tiet kiem: {{ formatCurrency(store.getTotalPriceSave) }})</span></Heading>
            <Heading tag="div" size="xl" weight="semibold" class="black">{{ formatCurrency(store.getTotalPriceDiscount) }} </Heading>
          </div>

          <div v-if="store.getTotalPriceSave != 0" class="popup-cart-footer-item popup-cart-footer-item-save">
          Don hang <span>{{ formatCurrency(store.getTotalPriceCurrent) }}</span>
          </div>

          <div class="popup-cart-footer-item popup-cart-footer-item-save">
          Phi van chuyen: <span>{{ formatCurrency(store.getShippingFee) }}</span>
          </div>

          <div v-if="store.discountVoucherFreeship" class="popup-cart-footer-item popup-cart-footer-item-save">
          Voucher phi van chuyen: <span>-{{ formatCurrency(store.discountVoucherFreeship) }}</span>
          </div>

          <div v-if="store.discountVoucher" class="popup-cart-footer-item popup-cart-footer-item-save">
          Voucher giảm giá: <span>-{{ formatCurrency(store.discountVoucher) }}</span>
          </div>

          <div v-if="store.getOrderPriceDiscount != 0" class="popup-cart-footer-item popup-cart-footer-item-save">
          Giam don hang <span>-{{ formatCurrency(store.getOrderPriceDiscount) }}</span>
          </div>

          <div v-if="store.usedPointOrder.usedPoint != 0" class="popup-cart-footer-item popup-cart-footer-item-save">
          Point <span>-{{ formatCurrency(store.usedPointOrder.usedPoint) }}</span>
          </div>

          <div v-if="store.totalDiscountRateMembership != 0" class="popup-cart-footer-item popup-cart-footer-item-save">
          Uu dai thanh vien <span>-{{ formatCurrency(store.totalDiscountRateMembership) }}</span>
          </div>

          <div v-if="store.getTotalPriceDiscount != 0 && storeAccount.getDetailValue?.id" class="popup-cart-footer-item popup-cart-footer-item-save">
            Hoan tien point
            <span class="text-color-primary">
              +{{ formatCurrency(store.getTotalPoint).replace('đ','') }}
            </span>
          </div>

          <Button type="submit" label="Dat hang" color="primary" class="mt-sm w-full" />
        </div>
      </div>
    </v-form>
    <div v-else class="text-center">
      <Heading weight="semibold" class="text-center">Gio hang</Heading>
      <div class="mt-sm mb-sm">Khong co san pham trong gio hang</div>
      <NuxtLink :to="{ path: ROUTES.PUBLIC.ORDER.path }">
        <Button tag="div" color="black" label="Dat hang ngay" />
      </NuxtLink>
    </div>
  </div>
</div>

<PopupManageAddress v-if="storeAccount.getDetailValue?.id" :idChoose="store.getIdAddressChoose"/>
</template>