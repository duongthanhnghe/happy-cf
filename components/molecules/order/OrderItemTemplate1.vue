<script lang="ts" setup>
import { formatCurrency, formatDateTime } from '@/utils/global'
import { useOrderHistoryStore } from '@/stores/client/order/useOrderHistoryStore'
import { ORDER_STATUS } from '@/shared/constants/order-status';
import { PAYMENT_TRANSACTION_STATUS } from '@/shared/constants/payment-transaction-status';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import { useOrderHelpers } from '@/utils/orderHelpers';
import { useSharedOrderDetailStore } from '@/stores/client/order/useSharedOrderDetailStore';
import type { OrderDTO } from '@/server/types/dto/v1/order.dto';
import { usePaymentMethodStore } from '@/stores/client/order/usePaymentMethodStore';

const store = useOrderHistoryStore()
const storeDisplay = useDisplayStore()
const storeDetailOrder = useSharedOrderDetailStore()
const storePaymentStatus = usePaymentMethodStore();

const { remainingProductNames } = useOrderHelpers()
const props = defineProps<{
  item: OrderDTO
}>();

</script>
<template>
  <Card :bg="storeDisplay.isLaptop ? 'gray6':'white'" class="rd-lg shadow-1 mb-ms">
    <div class="flex justify-between line-height-1">
      <div class="flex gap-xs align-center weight-semibold cursor-pointer" @click="storeDetailOrder.handleTogglePopupDetail(true, props.item?.id)">
        <Button size="xs" color="secondary" icon="package_2" :disable="true"/>
        {{ props.item?.code }}
      </div>
      <Text :text="formatDateTime(props.item?.createdAt, 'vi-VN',false)" color="gray5" />
    </div>
    <div :class="['flex gap-sm border-bottom-dashed mt-md mb-sm pb-sm', storeDisplay.isLaptop ? 'border-color-gray':'border-color-gray2']">
      <div class="flex gap-xs position-relative">
        <template v-for="(itemImage, index) in props.item?.cartItems" :key="index" >
          <Image 
            v-if="index < 3 && itemImage.idProduct.image"
            v-tooltip="itemImage.idProduct.productName"
            :src="itemImage.idProduct.image"
            preset="label"
            :alt="itemImage.idProduct.productName"
            :class="[storeDisplay.isLaptop ? 'bg-white':'bg-gray6','rd-lg width-50']"
          />
          <span v-tooltip.html="remainingProductNames(props.item?.cartItems)" v-else-if="index < 4" class="el-absolute max-width-50 right-0 align-center flex justify-center bg-black-40 text-color-white rd-lg">+{{ props.item?.cartItems.length - 3 }}</span>
          <template v-else />
        </template>
      </div>
      <div class="text-color-gray5">
        <div class="mb-xs">
          {{ props.item?.address }}
        </div>
        <span class="text-color-black weight-semibold text-size-normal">{{ formatCurrency(props.item?.totalPrice) }}</span>
      </div>
    </div>
    <div class="flex justify-between align-center">
      <div class="flex gap-xs">
        <v-chip v-if="storeDisplay.isLaptop" label color="gray">
          <Image 
            :src="props.item?.paymentId.image" alt="icon"
            :width="20"
            class="mr-xs"
          />
          {{ props.item?.paymentId.name }}
        </v-chip>
        <v-menu location="bottom start" transition="slide-y-transition">
          <template #activator="{ props: menuProps }">
            <Button
              v-bind="menuProps"
              v-if="(props.item?.transaction === null 
                || props.item?.transaction?.status !== PAYMENT_TRANSACTION_STATUS.paid.status
                || props.item?.transaction?.status !== PAYMENT_TRANSACTION_STATUS.refunded.status
                )
                && props.item?.status.id !== ORDER_STATUS.CANCELLED"
              size="sm"
              color="black"
              label="Thanh toán"
            />
          </template>

          <v-list class="min-width-180" v-if="storePaymentStatus.getListData && storePaymentStatus.getListData.length > 0">
            <v-list-item v-for="item in storePaymentStatus.getListData.filter(
                bank => bank.method !== 'cash'
              )"
              :key="item.id"
              @click="store.handlePaymentOrder(props.item?.id, item.id, props.item?.code, props.item?.totalPrice)"
            >
              <v-list-item-title class="flex align-center gap-sm">
                <Image :src="item.image" :width="20" />
                Thanh toán {{ item.name }}
              </v-list-item-title>
            </v-list-item>
          </v-list>
        </v-menu>

      </div>
      <div class="flex gap-xs">
        <template v-if="storeDisplay.isLaptop">
          <template v-if="props.item?.status.id === ORDER_STATUS.PENDING || props.item?.status.id === ORDER_STATUS.CANCELLED">
            <Button v-if="!props.item?.cancelRequested && props.item?.status.id !== ORDER_STATUS.CANCELLED" @click.prevent="store.handleCancelOrder(props.item?.id, props.item?.userId as string)" size="sm" color="secondary" label="Yêu cầu huỷ đơn"/>
            <Button v-else-if="props.item?.cancelRequested" v-tooltip.left="'Đã gửi yêu cầu huỷ đơn đến admin'" tag="span" size="sm" color="gray" :border="false" label="Đã yêu cầu" />
            <template v-else />
          </template>
        </template>
        <v-chip label :color="props.item?.status.status">
          {{ props.item?.status.name }}
        </v-chip>
      </div>
    </div>
  </Card>
</template>