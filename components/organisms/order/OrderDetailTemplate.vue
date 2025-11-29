<script lang="ts" setup>
import '@/styles/molecules/order/order-item-detail-template1.scss'
import { toRef } from 'vue'
import { useOrderHistoryStore } from '@/stores/client/order/useOrderHistoryStore'
import { formatCurrency, formatDateTime } from '@/utils/global'
import { useOrderDetail } from "@/composables/order/useOrderDetail";
import { ORDER_STATUS } from "@/shared/constants/order-status"
import { useBaseInformationStore } from '@/stores/shared/setting/useBaseInformationStore';
import { useOrderStatusStore } from '@/stores/shared/useOrderStatusStore';
import { useLocation } from "@/composables/product/useLocation"
import { useOrderDetailHandlers } from '@/composables/order/useOrderDetailHandlers';
import { useAccountStore } from '@/stores/client/users/useAccountStore';

const { getDetailOrder, fetchOrderDetail } = useOrderDetail();
const storeHistory = useOrderHistoryStore();
const storeOrderStatus = useOrderStatusStore();
const storeSetting = useBaseInformationStore();
const { 
  fetchProvinceDetail, 
  fetchDistrictDetail, 
  fetchWardDetail, 
  getProvinceDetail, 
  getDistrictDetail, 
  getWardDetail 
} = useLocation();
const storeAccount = useAccountStore();

const props = defineProps({
  idOrder: {
    type: String,
    default: ''
  },
});

const idOrderRef = toRef(props, 'idOrder')

const {
  activeIndex,
  totalDiscountVoucher
} = useOrderDetailHandlers(
  storeHistory,
  storeOrderStatus,
  getDetailOrder,
  idOrderRef,
  fetchProvinceDetail,
  fetchDistrictDetail,
  fetchWardDetail,
  fetchOrderDetail
)

</script>
<template>
  <template v-if="getDetailOrder && (getDetailOrder.userId === null || getDetailOrder.userId === storeAccount.getUserId)">
    <div class="text-center text-color-white text-size-xl weight-semibold">
      <div class="text-size-large weight-normal">Đơn hàng</div>
      {{ getDetailOrder?.code }}
    </div>
    <div v-if="getDetailOrder.status.id !== ORDER_STATUS.CANCELLED" class="flex justify-between mt-xl mb-md">
      <div v-for="(items, index) in storeOrderStatus.getListData.filter(i => i.id !== ORDER_STATUS.CANCELLED)" :key="items.id" :class="{ 'is-active': index <= activeIndex }" class="flex-1 text-center text-color-white popup-detail-order-status-item">
        <div class="avatar-src popup-detail-order-status-icon m-auto">
          <MaterialIcon size="xl" :name="items.icon"/>
        </div>
        <div class="mt-sm popup-detail-order-status-title">
          {{ items.name }}
        </div>
      </div>
    </div>
    <div v-else class="flex justify-between mt-md mb-md">
      <div class="is-active flex-1 text-center text-color-white popup-detail-order-status-item">
        <div class="avatar-src popup-detail-order-status-icon m-auto">
          <MaterialIcon size="xl" name="close"/>
        </div>
        <div class="mt-sm popup-detail-order-status-title">
          {{ getDetailOrder.status.name }}
        </div>
      </div>
    </div>
    
    <Card size="sm" class="rd-lg">
      <div class="flex justify-between">
        <span class="flex gap-xs align-center weight-semibold text-color-black">
          <Button size="xs" color="secondary" icon="location_on" :disable="true"/>
          {{ getDetailOrder?.address }},
          {{ getWardDetail?.WARDS_NAME }},
          {{ getDistrictDetail?.DISTRICT_NAME }},
          {{ getProvinceDetail?.PROVINCE_NAME }}
        </span>
        <span class="flex gap-xs align-center text-color-gray5">
          <Button size="xs" color="secondary" icon="schedule" :disable="true"/>
          {{ getDetailOrder?.time }}
        </span>
      </div>
      <div class="flex gap-xs align-center text-color-black mt-sm">
        <Button size="xs" color="secondary" icon="person" />
        {{ getDetailOrder?.fullname }} <span class="text-color-gray5">- {{ getDetailOrder?.phone }}</span>
      </div>
      <div v-if="getDetailOrder?.note" class="flex gap-xs align-center text-color-gray5 mt-sm">
        <Button size="xs" color="secondary" icon="edit" />
        {{ getDetailOrder?.note }}
      </div>
      <div class="mt-ms">
      <div v-for="(items, index) in getDetailOrder?.productList" :key="index">
        <CartItemTemplate2 v-bind="items" class="mt-xs"/>
      </div>
      </div>
      <div class="flex flex-direction-column gap-xs mt-xs">
      <div class="flex justify-between text-size-normal mt-sm weight-medium line-height-1">
        <div class="flex align-center gap-xs">
          Tổng cộng
          <span v-if="getDetailOrder?.totalPriceSave && getDetailOrder?.totalPriceSave !== 0" class="text-size-base text-color-green">(Tiết kiệm: {{ formatCurrency(getDetailOrder?.totalPriceSave) }})</span>
        </div>
        <div class="weight-semibold text-color-danger text-right mb-xs">
          {{ formatCurrency(getDetailOrder?.totalPrice) }}
        </div>
      </div>
      <div class="flex justify-between text-color-gray5">
        Đơn hàng
        <span>
          {{ formatCurrency(getDetailOrder?.totalPriceCurrent) }}
        </span>
      </div>
      <div v-if="getDetailOrder?.shippingFee" class="flex justify-between text-color-gray5">
        Phí vận chuyển
        <span>
          {{ formatCurrency(getDetailOrder?.shippingFee) }}
        </span>
      </div>
      <div v-if="getDetailOrder?.totalDiscountOrder && getDetailOrder?.totalDiscountOrder != 0" class="flex justify-between text-color-gray5">
        Giảm đơn hàng <span>-{{ formatCurrency(getDetailOrder?.totalDiscountOrder) }}</span>
      </div>
      <div v-if="getDetailOrder?.usedPoints !== 0" class="flex justify-between text-color-gray5">
        Điểm sử dụng
        <span class="flex align-center gap-xs">
          <v-chip v-if="getDetailOrder?.pointsRefunded" size="small" label color="secondary">Đã hoàn</v-chip>  -{{ formatCurrency(getDetailOrder?.usedPoints) }}
        </span>
      </div>
      <div v-if="getDetailOrder?.membershipDiscountAmount !== 0" class="flex justify-between text-color-gray5">
        Ưu đãi thành viên
        <span>
          -{{ formatCurrency(getDetailOrder?.membershipDiscountAmount) }}
        </span>
      </div>
      <div v-if="totalDiscountVoucher !== 0" class="flex justify-between text-color-gray5">
        Mã giảm giá
        <span class="flex align-center gap-xs">
          <v-chip v-if="getDetailOrder?.voucherRefunded" size="small" label color="secondary">Đã hoàn</v-chip> -{{ formatCurrency(totalDiscountVoucher) }} 
        </span>
      </div>
      <div class="flex gap-sm justify-end">
        <Button v-if="getDetailOrder?.reward.points != 0 && getDetailOrder?.reward.awarded" color="secondary" :label="`+${getDetailOrder?.reward.points}`" icon="diamond_shine" :disabled="false" size="sm" />
        <v-chip v-if="getDetailOrder.paymentId" label color="gray">
          <img width="20" :src="getDetailOrder?.paymentId.image" alt="icon" class="mr-xs"/>
          {{ getDetailOrder?.paymentId.name }}
        </v-chip>
        <v-chip v-if="getDetailOrder.transaction" label :color="getDetailOrder.transaction.statusColor">
          {{ getDetailOrder.transaction.statusText }}
        </v-chip>
        <v-chip v-else label>
          Chưa thanh toán
        </v-chip>
      </div>
      </div>
    </Card>
    <Card size="sm" class="rd-lg mt-sm flex gap-sm justify-between">
      <img class="avatar-src" :src="storeSetting.getBaseInformation?.logoUrl" :alt="storeSetting.getBaseInformation?.name" loading="lazy" /> 
      <div class="flex flex-1 justify-between">
        <div>
          <div class="weight-medium text-color-black">
            Người giao hàng
          </div>
          <span class="text-color-gray5 text-size-xs">{{ storeSetting.getBaseInformation?.name }}</span>
        </div>
        <div class="flex gap-sm">
          <a v-if="storeSetting.getBaseInformation?.phone" :href="`tel:${Number(storeSetting.getBaseInformation?.phone.replace(/\s+/g, ''))}`">
            <Button tag="span" color="gray" icon="phone" />
          </a>
          <a v-if="storeSetting.getBaseInformation?.socialLinks" :href="storeSetting.getBaseInformation?.socialLinks[0].src" target="_blank">
            <Button tag="span" color="black" icon="chat" />
          </a>
        </div>
      </div>
    </Card>
    <div class="text-center mt-sm">
      Thời gian đặt hàng: {{ formatDateTime(getDetailOrder?.createdAt) }}
    </div>
    <div v-if="getDetailOrder?.status.id === ORDER_STATUS.PENDING || getDetailOrder?.status.id === ORDER_STATUS.CANCELLED" class="mt-md">
      <Button v-if="getDetailOrder.userId && !getDetailOrder?.cancelRequested && getDetailOrder?.status.id !== ORDER_STATUS.CANCELLED" @click.prevent="storeHistory.handleCancelOrder(getDetailOrder?.id, getDetailOrder.userId)" size="lg" color="black" label="Yêu cầu huỷ đơn" icon="cancel" class="w-full rd-lg"/>
      <Button v-else-if="getDetailOrder?.cancelRequested" tag="span" color="black" :border="false" label="Đã yêu cầu huỷ đơn" icon="partner_reports" class="w-full rd-lg" />
      <template v-else />
    </div>
  </template>
  <NoData v-else />
</template>