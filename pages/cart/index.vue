<script lang="ts" setup>
import '@/styles/templates/cart/popup-cart.scss'
import type { SubmitEventPromise } from 'vuetify';
import { formatCurrency } from '@/utils/global'
import { showWarning } from '@/utils/toast'
import { useCartStore } from '@/stores/client/product/useCartOrderStore'
import { useAddressesManageStore } from '@/stores/client/users/useAddressesStore'
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { ROUTES } from '@/shared/constants/routes';
import { usePaymentStatusStore } from '@/stores/shared/usePaymentStatusStore'
import { nullRules, phoneRules } from '@/utils/validation'

definePageMeta({
  headerTypeLeft: ROUTES.PUBLIC.ORDER_TRACKING.headerTypeLeft,
})

const store = useCartStore();
const storeAddress = useAddressesManageStore();
const storeAccount = useAccountStore();
const storePaymentStatus = usePaymentStatusStore();

const submitOrder = async (event: SubmitEventPromise) => {
  const results = await event
  if (!results.valid) {
    showWarning('Vui lòng chọn đầy đủ thông tin!');
    return
  }
  store.submitOrder()
}

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
            <Button  @click.prevent="storeAddress.handleTogglePopupList(true,true,true)" size="xs" color="secondary" icon="keyboard_arrow_right"/>
            </slot>
          </Heading>
          <div class="popup-cart-information row row-sm">
            <div class="col-6">
              <LabelInput label="Giờ lấy hang" required/>
              <v-text-field type="time" v-model="store.informationOrder.time" required :rules="store.timeRules" variant="outlined" />
            </div>
            <div class="col-6">
              <LabelInput label="Địa chỉ nhận hàng" required/>
              <v-text-field type="text" required v-model="store.informationOrder.address" :rules="nullRules" variant="outlined" />
            </div>
            <div class="col-6">
              <LabelInput label="Họ và tên" required/>
              <v-text-field type="text" required v-model="store.informationOrder.fullname" :rules="nullRules" variant="outlined" />
            </div>
            <div class="col-6">
              <LabelInput label="Số điện thoại" required/>
              <v-text-field type="tel" required v-model="store.informationOrder.phone" :rules="phoneRules" maxlength="11" variant="outlined" />
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

        <div class="card-sm bg-white mt-ms">
          <div class="popup-cart-footer-item">
          <Heading tag="div" size="md" weight="normal">Tong cong</Heading>
          <Heading tag="div" size="xl" weight="semibold" class="black">{{ formatCurrency(store.getTotalPriceDiscount) }}</Heading>
          </div>
          <div v-if="store.getTotalPriceSave != 0" class="popup-cart-footer-item popup-cart-footer-item-save">
          Ban tiet kiem duoc {{ formatCurrency(store.getTotalPriceSave) }} <span class="popup-cart-footer-item-current">{{ formatCurrency(store.getTotalPriceCurrent) }}</span>
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

<PopupManageAddress v-if="storeAccount.getDetailValue?.id" :action="true" :idChoose="store.getIdAddressChoose"/>
</template>