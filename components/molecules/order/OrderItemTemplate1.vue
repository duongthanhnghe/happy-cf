<script lang="ts" setup>
import { formatCurrency, formatDateTime } from '@/utils/global'
import { useOrderHistoryStore } from '@/stores/client/order/useOrderHistoryStore'
import { ORDER_STATUS } from '@/shared/constants/order-status';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';
import { useOrderHelpers } from '@/utils/orderHelpers';
import { useSharedOrderDetailStore } from '@/stores/shared/order/useSharedOrderDetailStore';
import type { OrderDTO } from '@/server/types/dto/v1/order.dto';

const store = useOrderHistoryStore()
const storeDisplay = useDisplayStore()
const storeDetailOrder = useSharedOrderDetailStore()
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
          <img v-tooltip="itemImage.idProduct.productName" v-if="index < 3 && itemImage.idProduct.image" :class="[storeDisplay.isLaptop ? 'bg-white':'bg-gray6','rd-lg']" width="50" :src="itemImage.idProduct.image" :alt="itemImage.idProduct.productName" />
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
          <img width="20" :src="props.item?.paymentId.image" alt="icon" class="mr-xs"/>
          {{ props.item?.paymentId.name }}
        </v-chip>
        <Button v-if="props.item?.transaction === null && props.item?.status.id !== ORDER_STATUS.CANCELLED" @click.prevent="store.handlePaymentOrder(props.item?.id, props.item?.code, props.item?.totalPrice)" size="sm" color="black" label="Thanh toán"/>
      </div>
      <div class="flex gap-xs">
        <template v-if="storeDisplay.isLaptop">
          <template v-if="props.item?.status.id === ORDER_STATUS.PENDING || props.item?.status.id === ORDER_STATUS.CANCELLED">
            <Button v-if="!props.item?.cancelRequested && props.item?.status.id !== ORDER_STATUS.CANCELLED" @click.prevent="store.handleCancelOrder(props.item?.id, props.item?.userId)" size="sm" color="secondary" label="Yêu cầu huỷ đơn"/>
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