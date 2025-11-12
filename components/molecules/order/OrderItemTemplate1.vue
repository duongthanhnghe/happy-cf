<script lang="ts" setup>
import '@/styles/molecules/order/order-item-template1.scss'
import { formatCurrency, formatDateTime } from '@/utils/global'
import { useOrderHistoryStore } from '@/stores/client/order/useOrderHistoryStore'
import { useBaseInformationStore } from '@/stores/shared/setting/useBaseInformationStore';
import { ORDER_STATUS } from '@/shared/constants/order-status';

const storeSetting = useBaseInformationStore();
const store = useOrderHistoryStore();
const props = defineProps({
  item: {
    type: Object,
  }
})

</script>
<template>
  <div class="card card-sm bg-white mb-sm">
    <div class="flex justify-between line-height1">
      <div class="flex gap-xs align-center weight-semibold cursor-pointer" @click="store.handleTogglePopupDetail(true, props.item?.id)">
        <Button size="xs" color="secondary" icon="package_2" :disable="true"/>
        {{ props.item?.code }}
      </div>
      <div class="flex gap-xs align-center text-color-gray5 text-size-xs">
        <Button size="xs" color="secondary" icon="schedule" :disable="true"/>
        {{ formatDateTime(props.item?.createdAt, 'vi-VN',false) }}
      </div>
    </div>
    <div class="order-template-content flex gap-sm align-center mt-sm mb-sm">
      <div>
        <img v-if="storeSetting.getBaseInformation?.logoUrl" class="avatar-src" :src="storeSetting.getBaseInformation?.logoUrl" :alt="storeSetting.getBaseInformation?.name" />
      </div>
      <div class="text-color-gray5">
        <div class="mb-xs">
          {{ props.item?.address }}
        </div>
        <div class="flex align-center gap-xs">
          <span class="text-color-black weight-semibold text-size-normal">{{ formatCurrency(props.item?.totalPrice) }}</span>
          <div class="text-size-xs">
          ({{ props.item?.cartItems.length }} mon)
          </div>
        </div>
      </div>
    </div>
    <div class="flex justify-between align-center">
      <div class="flex gap-xs">
        <v-chip label color="gray">
          <img width="20" :src="props.item?.paymentId.image" alt="icon" class="mr-xs"/>
          {{ props.item?.paymentId.name }}
        </v-chip>
        <Button v-if="props.item?.transaction === null && props.item?.status.id !== ORDER_STATUS.CANCELLED" @click.prevent="store.handlePaymentOrder(props.item?.id, props.item?.code, props.item?.totalPrice)" size="sm" color="secondary" label="Thanh toan"/>
      </div>
      <div class="flex gap-xs">
        <template v-if="props.item?.status.id === ORDER_STATUS.PENDING || props.item?.status.id === ORDER_STATUS.CANCELLED">
          <Button v-if="!props.item?.cancelRequested && props.item?.status.id !== ORDER_STATUS.CANCELLED" @click.prevent="store.handleCancelOrder(props.item?.id, props.item?.userId)" size="sm" color="secondary" label="Yeu cau huy don"/>
          <Button v-else-if="props.item?.cancelRequested" v-tooltip.left="'Da gui yeu cau huy don den admin'" tag="span" size="sm" color="gray" :border="false" label="Da yeu cau" />
          <template v-else />
        </template>
        <v-chip label :color="props.item?.status.status">
          {{ props.item?.status.name }}
        </v-chip>
      </div>
    </div>
  </div>
</template>