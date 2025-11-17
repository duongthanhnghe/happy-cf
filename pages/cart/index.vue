<script lang="ts" setup>
import '@/styles/templates/cart/cart.scss'
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
import { useLocationWatchers } from '@/composables/shared/location/useLocationWatchers';
import { useCartLocationWatchers } from '@/composables/cart/useCartLocationWatchers';
import { useDisplayStore } from '@/stores/shared/useDisplayStore'

definePageMeta({
  middleware: ROUTES.PUBLIC.CART.middleware,
  layout: ROUTES.PUBLIC.CART.layout,
  headerTypeLeft: ROUTES.PUBLIC.ORDER_TRACKING.headerTypeLeft,
})

const store = useCartStore();
const storeAddress = useAddressesManageStore();
const storeAccount = useAccountStore();
const storePaymentStatus = usePaymentStatusStore();
const storeLocation = useLocationStore();
const eventBus = useEventBus();
const storeDisplay = useDisplayStore()

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

const { removeVoucher, handleVoucherReset, handleApplyVoucherInput } = useCartVoucherHandlers(
  store,
  selectedFreeship,
  selectedVoucher,
  voucherCode
);

useLocationWatchers(storeLocation);
useCartLocationWatchers(storeLocation, store);

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
    if (storeAccount.getUserId) {
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
  // storeLocation.resetLocation();
  eventBus.off('voucher:reset', handleVoucherReset);
  store.isTogglePopupVoucher = false;
  store.isTogglePopupPoint = false;
});

</script>
<template>

<div class="bg-gray6 cart-body">
  <div class="container">
    <BreadcrumbDefault />

    <v-form v-if="store.getCartListItem && store.getCartListItem.length > 0" validate-on="submit lazy" @submit.prevent="submitOrder">
      <div>
        <div class="rd-lg overflow-hidden">
          <Text text="Gio hang" color="black" size="md" weight="semibold" class="mb-xs" />
          <div class="flex flex-direction-column gap-xs">
            <CartItemTemplate1 v-for="(item, index) in store.getCartListItem" :key="index" :item="item" />
          </div>
        </div>
        <Card v-if="store.getTotalPriceDiscount != 0 && storeAccount.getUserId" border class="rd-xl flex justify-between mt-sm">
          Tang diem tuy lich
          <span class="flex gap-xs weight-semibold">
            <Button size="xs" color="secondary" icon="diamond_shine"/>
            {{ store.getTotalPoint }}
          </span>
        </Card>
        
        <Card class="rd-xl mt-sm shadow-1">
          <Text color="black" size="md" weight="semibold" class="flex justify-between black mb-sm">
            Thông tin đặt hàng
            <slot v-if="storeAccount.getUserId">
              <Button  @click.prevent="storeAddress.handleTogglePopupList(true,true)" size="xs" color="secondary" icon="keyboard_arrow_right"/>
            </slot>
          </Text>
          <div class="row row-xs">
            <div class="col-6">
              <LabelInput label="Giờ lấy hang" required/>
              <v-text-field type="time" v-model="store.informationOrder.time" required :rules="store.timeRules" variant="outlined" />
            </div>
            <div class="col-6">
              <LabelInput label="Họ và tên" required/>
              <v-text-field type="text" required v-model="store.informationOrder.fullname" :rules="nullRules" variant="outlined" />
            </div>
            <div class="col-12 col-md-6">
              <LabelInput label="Số điện thoại" required/>
              <v-text-field type="tel" required v-model="store.informationOrder.phone" :rules="phoneRules" maxlength="11" variant="outlined" />
            </div>
            <div class="col-12 col-md-6">
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

          <Text text="Thanh toan" color="black" size="md" weight="semibold" class="mb-sm" />
          <v-radio-group inline v-model="store.paymentSelected" class="payment-template1-group" nameRadio="namePayment">
            <PaymentItemTemplate1 v-for="(item, index) in storePaymentStatus.getListData" :key="index" :item="item" />
          </v-radio-group>

          <Text text="Ghi chu" color="black" size="md" weight="semibold" class="mb-sm" />
          <v-textarea class="mb-0" :rows="5" v-model="store.informationOrder.note" variant="outlined" hide-details />
        </Card>

        <template v-if="!storeDisplay.isMobileTable">
          <Card v-if="storeAccount.getUserId" class="rd-xl mt-sm shadow-1">
            <Heading tag="div" size="md" weight="semibold" class="black mb-sm">
              Su dung diem <span>(Ban dang co {{ storeAccount.getDetailValue.membership.balancePoint }})</span>
            </Heading>
            <div class="flex gap-sm">
              <v-text-field type="number" placeholder="Nhập số điểm" v-model="store.usedPointOrder.pointInput" variant="outlined" hide-details/>
              <Button @click.prevent="store.handleCheckPoint()" color="black" label="Ap dung" :disabled="store.usedPointOrder.pointInput == 0" />
            </div>
          </Card>

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

            <div v-if="storeAccount.getUserId" class="flex gap-sm mt-md">
              <v-text-field type="text" placeholder="Nhập mã voucher" v-model="voucherCode" variant="outlined" hide-details/>
              <Button @click.prevent="handleApplyVoucherInput()" color="black" label="Ap dung" :disabled="!voucherCode" />
            </div>
          </div>
        </template>

        <Card class="rd-xl mt-sm shadow-1 mt-ms">
          <Text text="Chi tiet thanh toan" color="black" size="md" weight="semibold" />
          <div class="line-height-1 flex justify-between mt-sm">
            <Text color="gray5" text="Thanh tien" />
            <Text size="md" weight="semibold" class="black">{{ formatCurrency(store.getTotalPriceDiscount) }} </Text>
          </div>

          <Text v-if="store.getTotalPriceSave != 0" color="gray5" class="flex justify-between mt-xs">
          Don hang <span>{{ formatCurrency(store.getTotalPriceCurrent) }}</span>
          </Text>

          <Text color="gray5" class="flex justify-between mt-xs">
          Phi van chuyen: <span>{{ formatCurrency(store.getShippingFee) }}</span>
          </Text>

          <Text v-if="store.discountVoucherFreeship" color="gray5" class="flex justify-between mt-xs">
          Voucher phi van chuyen: <span>-{{ formatCurrency(store.discountVoucherFreeship) }}</span>
          </Text>

          <Text v-if="store.discountVoucher" color="gray5" class="flex justify-between mt-xs">
          Voucher giảm giá: <span>-{{ formatCurrency(store.discountVoucher) }}</span>
          </Text>

          <Text v-if="store.getOrderPriceDiscount != 0" color="gray5" class="flex justify-between mt-xs">
          Giam don hang <span>-{{ formatCurrency(store.getOrderPriceDiscount) }}</span>
          </Text>

          <Text v-if="store.usedPointOrder.usedPoint != 0" color="gray5" class="flex justify-between mt-xs">
          Point <span>-{{ formatCurrency(store.usedPointOrder.usedPoint) }}</span>
          </Text>

          <Text v-if="store.totalDiscountRateMembership != 0" color="gray5" class="flex justify-between mt-xs">
          Uu dai thanh vien <span>-{{ formatCurrency(store.totalDiscountRateMembership) }}</span>
          </Text>

          <Text v-if="store.getTotalPriceDiscount != 0 && storeAccount.getUserId" color="gray5" class="flex justify-between mt-xs">
            Hoan tien point
            <Text color="danger" :text="`+${ formatCurrency(store.getTotalPoint).replace('đ','') }`" />
          </Text>

          <template v-if="storeDisplay.isMobileTable">
            <div class="cart-mb-submit shadow-2">
              <div class="flex justify-between cart-mb-submit-item" @click.prevent="store.handleTogglePopupVoucher(true)">
                <Text color="gray5" text="Voucher" />
                <div v-if="selectedVoucher || selectedFreeship" class="flex align-center gap-xs">
                  <template v-if="store.voucherUsage.length > 0">
                    <template
                      v-for="(voucherUsage, index) in store.voucherUsage"
                      :key="voucherUsage.code"
                    >
                      <Text
                        color="gray5"
                        :text="voucherUsage.code"
                      />
                      <span v-if="index < store.voucherUsage.length - 1">, </span>
                    </template>
                  </template>
                  <MaterialIcon name="keyboard_arrow_right"/>
                </div>
                <Text v-else color="gray5" class="line-height-1 flex align-center gap-xs">
                  Chon voucher
                  <MaterialIcon name="keyboard_arrow_right"/>
                </Text>
              </div>

              <div v-if="storeAccount.getUserId" class="flex justify-between cart-mb-submit-item" @click.prevent="store.handleTogglePopupPoint(true)">
                <Text color="gray5" text="Point" />
                <Text v-if="!store.usedPointOrder.pointInput" color="gray5" class="line-height-1 flex align-center gap-xs">
                  Dang co: {{ formatCurrency(storeAccount.getDetailValue.membership.balancePoint).replace('đ','') }}
                  <MaterialIcon name="keyboard_arrow_right"/>
                </Text>
                <Text v-else color="gray5" class="line-height-1 flex align-center gap-xs">
                  Su dung: <Text color="primary" weight="semibold" :text="formatCurrency(store.usedPointOrder.pointInput).replace('đ','')" />
                  <MaterialIcon name="keyboard_arrow_right"/>
                </Text>
              </div>

              <div class="flex justify-between">
                <div>
                <Text color="gray5" text="Thanh tien" />
                <Text color="green" :text="`Tiet kiem: ${ formatCurrency(store.getTotalPriceSave) }`" />
                </div>
                <Text size="md" weight="semibold" class="black">{{ formatCurrency(store.getTotalPriceDiscount) }} </Text>
              </div>
              <Button type="submit" label="Dat hang" color="primary" class="mt-xs w-full" />
            </div>
          </template>
          <template v-else>
            <Button type="submit" label="Dat hang" color="primary" class="mt-sm w-full" />
          </template>
          
        </Card>
      </div>
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
    <Popup v-model="store.isTogglePopupPoint" popupHeading="Su dung Point" bodyClass="bg-gray6" footerFixed align="right">
      <template #body v-if="storeAccount.getUserId">
        <template v-if="storeAccount.getUserId">
          <div class="flex gap-sm mb-lg">
            <Card size="sm" bg="white" border class="flex-1 rd-lg line-height-1 shadow-1">
              <Text text="Bạn đang có" />
              <Text :text="`${formatCurrency(storeAccount.getDetailValue.membership.balancePoint).replace('đ','')} Point`" weight="semibold" size="md" class="mt-sm mb-sm" />
              <Text text="Đang chờ 0 point" />
            </Card>
            <Card size="sm" bg="black" class="flex-1 rd-lg" style="max-width: 140px">
              <NuxtLink :to="{ path: ROUTES.PUBLIC.ORDER.path }">
                <Text :text="`PointClub Reward Hub`" color="white" weight="semibold" size="normal" />
              </NuxtLink>
              <svg width="40" height="12" viewBox="0 0 40 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M39.5303 6.53033C39.8232 6.23743 39.8232 5.76256 39.5303 5.46967L34.7574 0.696696C34.4645 0.403803 33.9896 0.403803 33.6967 0.696696C33.4038 0.98959 33.4038 1.46446 33.6967 1.75736L37.9393 6L33.6967 10.2426C33.4038 10.5355 33.4038 11.0104 33.6967 11.3033C33.9896 11.5962 34.4645 11.5962 34.7574 11.3033L39.5303 6.53033ZM6.55671e-08 6.75L39 6.75L39 5.25L-6.55671e-08 5.25L6.55671e-08 6.75Z" fill="white"></path>
              </svg>
            </Card>
          </div>

          <div class="mb-xl">
            Tối đa: <Text weight="semibold" color="primary" tag="span" :text="`${formatCurrency(store.getMaxPointCanUse).replace('đ','')} Point`" />
            <v-text-field type="number" placeholder="Nhập số điểm" v-model="store.usedPointOrder.pointInput" variant="outlined" class="mt-xs" hide-details/>
            <Button @click.prevent="store.handleCheckPoint()" color="black" label="Ap dung" class="w-full mt-sm" :disabled="store.usedPointOrder.pointInput == 0" />
          </div>

          <div class="mb-md">
            <Text weight="semibold" color="black" class="text-uppercase" text="Lưu ý" />
            <ul class="list-disc pl-lg">
              <li class="mt-xs">Point bạn áp dụng cho đơn hàng sẽ được khấu trừ từ tài khoản của bạn sau khi bạn nhấp vào <span class="weight-bold">"Thanh toán"</span>.</li>
              <li class="mt-xs">Bạn có thể hủy đơn hàng trong <span class="weight-bold">"Lịch sử đơn hàng"</span> số Point bạn đã áp dụng sẽ hoàn lại tài khoản của bạn.</li>
              <li class="mt-xs">Point có thể được sử dụng lên tới <span class="weight-bold">10% tổng giá trị thanh toán</span>.</li>
            </ul>
          </div>

          <NuxtLink :to="{ path: ROUTES.PUBLIC.ORDER.path }">
            <Button color="primary" label="Hướng dẫn Point" />
          </NuxtLink>
        </template>
        <NoData v-else text="Vui long dang nhap de su dung"/>
      </template>
    </Popup>


    <!-- POPUP CHOOSE VOUCHER -->
    <Popup v-model="store.isTogglePopupVoucher" popupHeading="Voucher giảm giá" bodyClass="bg-gray6" footerFixed align="right">
      <template #body>
        <div v-if="store.allVouchers?.length">
          <div v-if="selectedVoucher || selectedFreeship" class="mb-md">
            <Text text="Voucher dang ap dung" color="black" size="normal" weight="semibold" class="mb-sm" />
            <div v-if="store.voucherUsage.length > 0" class="flex gap-xs flex-wrap mb-sm">
              <Button
                v-for="(voucherUsage, index) in store.voucherUsage"
                color="secondary" class="pl-sm pr-sm" @click.prevent="removeVoucher(voucherUsage.code, voucherUsage.type);" :label="voucherUsage.code">
                <MaterialIcon class="ml-xs" name="close"/>
              </Button>
            </div>
            <div v-if="store.messageVoucher" v-html="store.messageVoucher" class="text-color-green">
            </div>
          </div>

          <div v-if="storeAccount.getUserId" class="flex gap-xs mb-md">
            <v-text-field type="text" placeholder="Nhập mã voucher" v-model="voucherCode" variant="outlined" hide-details/>
            <Button @click.prevent="handleApplyVoucherInput()" color="black" label="Ap dung" :disabled="!voucherCode" />
          </div>

          <div class="position-relative">
            <Text text="Voucher đề xuất cho bạn" color="black" size="normal" weight="semibold" class="mb-sm" />
            <div class="shape-loading" v-if="store.loadingAllVouchers">
              <v-progress-circular indeterminate ></v-progress-circular>
            </div>
            <div v-if="store.allVouchers?.length" class="flex flex-direction-column gap-sm">
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
        </div>
      </template>
      <template #footer>
        <div class="text-center">
          <Button color="black" label="Tiep tuc thanh toan" @click.prevent="store.handleTogglePopupVoucher(false)"/>
        </div>
      </template>
    </Popup>
  </template>

  <PopupManageAddress v-if="storeAccount.getUserId" :idChoose="store.getIdAddressChoose"/>
</template>