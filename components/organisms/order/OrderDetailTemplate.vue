<script lang="ts" setup>
import '@/styles/molecules/order/order-item-detail-template1.scss'
import { useOrderHistoryStore } from '@/stores/client/order/useOrderHistoryStore'
import { formatCurrency, formatDateTime } from '@/utils/global'
import { ORDER_STATUS } from "@/shared/constants/order-status"
import { useBaseInformationStore } from '@/stores/client/base-information/useBaseInformationStore';
import { useOrderStatusStore } from '@/stores/client/order/useOrderStatusStore';
import { useAccountStore } from '@/stores/client/users/useAccountStore';
import { useSharedOrderDetailStore } from '@/stores/client/order/useSharedOrderDetailStore';
import { useShippingHelpers } from '@/utils/shippingHelpers';

const storeHistory = useOrderHistoryStore();
const storeOrderStatus = useOrderStatusStore();
const storeSetting = useBaseInformationStore();
const storeAccount = useAccountStore();
const storeDetailOrder = useSharedOrderDetailStore()
const { checkFreeShip } = useShippingHelpers()

</script>
<template>
  <template v-if="storeDetailOrder.getDetailOrder && (storeDetailOrder.getDetailOrder.userId === null || storeDetailOrder.getDetailOrder.userId === storeAccount.getUserId)">
    <div class="text-center text-color-white text-size-xl weight-semibold">
      <div class="text-size-large weight-normal">Đơn hàng</div>
      {{ storeDetailOrder.getDetailOrder?.code }}
    </div>
    <div v-if="storeDetailOrder.getDetailOrder.status.id !== ORDER_STATUS.CANCELLED" class="flex justify-between mt-xl mb-md">
      <div v-for="(items, index) in storeOrderStatus.getListData.filter(i => i.id !== ORDER_STATUS.CANCELLED)" :key="items.id" :class="{ 'is-active': index <= storeDetailOrder.activeIndex }" class="flex-1 text-center text-color-white popup-detail-order-status-item">
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
          {{ storeDetailOrder.getDetailOrder.status.name }}
        </div>
      </div>
    </div>
    
    <Card size="sm" class="rd-lg">
      <div class="flex justify-between gap-xs">
        <span class="flex gap-xs align-center weight-semibold text-color-black">
          <Button size="xs" color="secondary" icon="location_on" :disable="true"/>
          {{ storeDetailOrder.getDetailOrder?.address }},
          {{ storeDetailOrder.getDetailOrder?.wardName }},
          {{ storeDetailOrder.getDetailOrder?.districtName }},
          {{ storeDetailOrder.getDetailOrder?.provinceName }}
        </span>
        <span class="flex gap-xs align-center text-color-gray5">
          <Button size="xs" color="secondary" icon="schedule" :disable="true"/>
          {{ storeDetailOrder.getDetailOrder?.time }}
        </span>
      </div>
      <div class="flex gap-xs align-center text-color-black mt-sm">
        <Button size="xs" color="secondary" icon="person" />
        {{ storeDetailOrder.getDetailOrder?.fullname }} <span class="text-color-gray5">- {{ storeDetailOrder.getDetailOrder?.phone }}</span>
      </div>
      <div v-if="storeDetailOrder.getDetailOrder?.note" class="flex gap-xs align-center text-color-gray5 mt-sm">
        <Button size="xs" color="secondary" icon="edit" />
        {{ storeDetailOrder.getDetailOrder?.note }}
      </div>
      <div class="mt-ms">
        <div v-for="(items, index) in storeDetailOrder.getDetailOrder?.cartItems" :key="items.combinationId">
          <CartItemTemplate2 :item="items" class="mt-sm"/>
        </div>
        <div v-if="storeDetailOrder.getDetailOrder.giftItems" v-for="(items, index) in storeDetailOrder.getDetailOrder.giftItems" :key="items.promotionGiftId">
          <CartItemTemplate2 :item="items" :gift="true" class="mt-sm"/>
        </div>
      </div>
      <div class="flex flex-direction-column gap-xs mt-xs">
      <div class="flex justify-between text-size-normal mt-sm weight-medium line-height-1">
        <div class="flex align-center gap-xs">
          Tổng cộng
          <span 
            v-if="storeDetailOrder.getDetailOrder?.totalPriceSave && storeDetailOrder.getDetailOrder?.totalPriceSave !== 0" 
            class="text-size-base text-color-green">
              (Tiết kiệm: 
              {{ checkFreeShip(storeDetailOrder.getDetailOrder?.shippingFee,storeDetailOrder.getDetailOrder.shippingConfig.minOrderAmount,storeDetailOrder.getDetailOrder.shippingConfig.enabled)
              ? formatCurrency((storeDetailOrder.getDetailOrder?.totalPriceSave + storeDetailOrder.getDetailOrder?.shippingFee))
              : formatCurrency(storeDetailOrder.getDetailOrder?.totalPriceSave) }}
              <!-- {{ formatCurrency(storeDetailOrder.getDetailOrder?.totalPriceSave) }} -->
              )
            </span>
        </div>
        <div class="weight-semibold text-color-danger text-right mb-xs">
          {{ checkFreeShip(storeDetailOrder.getDetailOrder?.shippingFee,storeDetailOrder.getDetailOrder.shippingConfig.minOrderAmount,storeDetailOrder.getDetailOrder.shippingConfig.enabled)
          ? formatCurrency((storeDetailOrder.getDetailOrder?.totalPrice - storeDetailOrder.getDetailOrder?.shippingFee))
          : formatCurrency(storeDetailOrder.getDetailOrder?.totalPrice) }}
        </div>
      </div>
      <div class="flex justify-between text-color-gray5">
        Đơn hàng
        <span>
          {{ formatCurrency(storeDetailOrder.getDetailOrder?.totalPriceCurrent) }}
        </span>
      </div>
      <div v-if="storeDetailOrder.getDetailOrder?.shippingFee !== null" class="flex justify-between text-color-gray5">
        Phí vận chuyển
        <span>
          {{ checkFreeShip(storeDetailOrder.getDetailOrder?.shippingFee,storeDetailOrder.getDetailOrder.shippingConfig.minOrderAmount,storeDetailOrder.getDetailOrder.shippingConfig.enabled)
          ? 'Miễn phí'
          : formatCurrency(storeDetailOrder.getDetailOrder?.shippingFee) }}
        </span>
      </div>
      <div v-if="storeDetailOrder.getDetailOrder?.totalDiscountOrder && storeDetailOrder.getDetailOrder?.totalDiscountOrder != 0" class="flex justify-between text-color-gray5">
        Giảm đơn hàng <span>-{{ formatCurrency(storeDetailOrder.getDetailOrder?.totalDiscountOrder) }}</span>
      </div>
      <div v-if="storeDetailOrder.getDetailOrder?.usedPoints !== 0" class="flex justify-between text-color-gray5">
        Điểm sử dụng
        <span class="flex align-center gap-xs">
          <v-chip v-if="storeDetailOrder.getDetailOrder?.pointsRefunded" size="small" label color="secondary">Đã hoàn</v-chip>  -{{ formatCurrency(storeDetailOrder.getDetailOrder?.usedPoints) }}
        </span>
      </div>
      <div v-if="storeDetailOrder.getDetailOrder?.membershipDiscountAmount !== 0" class="flex justify-between text-color-gray5">
        Ưu đãi thành viên
        <span>
          -{{ formatCurrency(storeDetailOrder.getDetailOrder?.membershipDiscountAmount) }}
        </span>
      </div>
      <div v-if="storeDetailOrder.totalDiscountVoucher !== 0" class="flex justify-between text-color-gray5">
        Mã giảm giá
        <span class="flex align-center gap-xs">
          <v-chip v-if="storeDetailOrder.getDetailOrder?.voucherRefunded" size="small" label color="secondary">Đã hoàn</v-chip> -{{ formatCurrency(storeDetailOrder.totalDiscountVoucher) }} 
        </span>
      </div>
      <div class="flex gap-sm justify-end">
        <Button v-if="storeDetailOrder.getDetailOrder?.reward.points != 0 && storeDetailOrder.getDetailOrder?.reward.awarded" color="secondary" :label="`+${storeDetailOrder.getDetailOrder?.reward.points}`" icon="diamond_shine" :disabled="false" size="sm" />
        <v-chip v-if="storeDetailOrder.getDetailOrder.paymentId" label color="gray">
          <Image 
            :src="storeDetailOrder.getDetailOrder?.paymentId.image" 
            alt="icon"
            :width="20"
            class="mr-xs"
          />
          {{ storeDetailOrder.getDetailOrder?.paymentId.name }}
        </v-chip>
        <v-chip v-if="storeDetailOrder.getDetailOrder.transaction" label :color="storeDetailOrder.getDetailOrder.transaction.statusColor">
          {{ storeDetailOrder.getDetailOrder.transaction.statusText }}
        </v-chip>
        <v-chip v-else label>
          Chưa thanh toán
        </v-chip>
      </div>
      </div>
    </Card>
    <Card size="sm" class="rd-lg mt-sm flex gap-sm justify-between">
      <Logo class="rd-full object-fit-cover bg-white border-default width-xl flex" />
      <div class="flex flex-1 justify-between">
        <div>
          <div class="weight-medium text-color-black">
            Hỗ trợ đơn hàng
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
      Thời gian đặt hàng: {{ formatDateTime(storeDetailOrder.getDetailOrder?.createdAt) }}
    </div>
    <div v-if="storeDetailOrder.getDetailOrder?.status.id === ORDER_STATUS.PENDING || storeDetailOrder.getDetailOrder?.status.id === ORDER_STATUS.CANCELLED" class="mt-md">
      <Button v-if="storeDetailOrder.getDetailOrder.userId && !storeDetailOrder.getDetailOrder?.cancelRequested && storeDetailOrder.getDetailOrder?.status.id !== ORDER_STATUS.CANCELLED" @click.prevent="storeHistory.handleCancelOrder(storeDetailOrder.getDetailOrder?.id, storeDetailOrder.getDetailOrder.userId)" size="lg" color="black" label="Yêu cầu huỷ đơn" icon="cancel" class="w-full rd-lg"/>
      <Button v-else-if="storeDetailOrder.getDetailOrder?.cancelRequested" tag="span" color="black" :border="false" label="Đã yêu cầu huỷ đơn" icon="partner_reports" class="w-full rd-lg" />
      <template v-else />
    </div>
  </template>
  <NoData v-else />
</template>