<script lang="ts" setup>
import '@/styles/molecules/order/order-item-detail-template1.scss'
import { ref, computed, watch } from 'vue'
import {
  useOrderHistoryStore
} from '@/stores/order/useOrderHistoryStore'
import {
  formatCurrency
} from '@/utils/global'
import { useOrderDetail } from "@/composables/order/useOrderDetail";
import { ORDER_STATUS } from "@/shared/constants/order-status"
import { useSettingStore } from '@/stores/setting/useSettingStore';

const { getDetailOrder, fetchOrderDetail } = useOrderDetail();
const storeHistory = useOrderHistoryStore();
const storeSetting = useSettingStore();
const props = defineProps({
  idOrder: {
    type: String,
    default: ''
  },
});
const elCurrent = ref(ORDER_STATUS.PENDING)

const activeIndex = computed(() => {
  return storeHistory.getListStatus.findIndex(item => item.id === elCurrent.value)
})

watch(() => props.idOrder, () => {
    if(storeHistory.isTogglePopupDetail || storeHistory.getCheckPageDetail){
      fetchOrderDetail(props.idOrder);
    }
  },
  { immediate: true }
)

watch(() => getDetailOrder.value?.status.id, (newId) => {
    if (newId) {
      elCurrent.value = newId || ORDER_STATUS.PENDING
    }
  },
  { immediate: true }
)

</script>
<template>
  <template v-if="getDetailOrder">
    <div class="text-center text-color-white text-size-xl weight-semibold">
      <div class="text-size-large weight-normal">Đơn hàng</div>
      {{ getDetailOrder?.code }}
    </div>
    <div v-if="storeHistory.getListStatus" class="flex justify-between mt-xl mb-md">
      <div v-for="(items, index) in storeHistory.getListStatus.filter(i => i.id !== ORDER_STATUS.CANCELLED)" :key="items.id" :class="{ 'is-active': index <= activeIndex }" class="flex-1 text-center text-color-white popup-detail-order-status-item">
        <div class="avatar-src popup-detail-order-status-icon m-auto">
          <MaterialIcon size="26" :name="items.icon"/>
        </div>
        <div class="mt-sm popup-detail-order-status-title">
          {{ items.name }}
        </div>
      </div>
    </div>
    
    <div class="card-sm bg-white">
      <div class="flex justify-between">
        <span class="flex gap-xs align-center weight-semibold text-color-black">
          <Button size="xs" color="secondary" icon="location_on" :disable="true"/>
          {{ getDetailOrder?.address }}
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
      <div class="row" v-for="items in getDetailOrder?.productList">
        <CartItemTemplate2 v-bind="items" />
      </div>
      <div class="flex justify-between text-size-normal mt-sm weight-medium">
        Tong cong
        <div class="weight-semibold text-color-danger text-right mb-xs">
          {{ formatCurrency(getDetailOrder?.totalPrice) }}
        </div>
      </div>
      <div class="flex gap-sm justify-end mt-xs">
        <v-chip v-if="getDetailOrder.paymentId" label color="gray">
          <img width="20" :src="getDetailOrder?.paymentId.image" alt="icon" class="mr-xs"/>
          {{ getDetailOrder?.paymentId.name }}
        </v-chip>
        <Button v-if="getDetailOrder?.point != 0" color="secondary" :label="`+${getDetailOrder?.point}`" icon="diamond_shine" :disabled="false" size="sm" />
      </div>
    </div>
    <div class="card-sm bg-white mt-sm flex gap-sm justify-between">
      <img class="avatar-src" :src="storeSetting.getSettings?.logoUrl" :alt="storeSetting.getSettings?.name" loading="lazy" /> 
      <div class="flex flex-1 justify-between">
        <div>
          <div class="weight-medium text-color-black">
            Nhan vien giao hang
          </div>
          <span class="text-color-gray5 text-size-xs">{{ storeSetting.getSettings?.name }}</span>
        </div>
        <a :href="`tel:${Number(storeSetting.getSettings?.phone.replace(/\s+/g, ''))}`">
          <Button icon="phone" />
        </a>
      </div>
    </div>
    <div class="text-center text-color-white mt-xs">
      Dat luc: {{ getDetailOrder?.createdAt }}
    </div>
  </template>
  <template v-else>
    <div class="text-center text-color-white text-size-large weight-semibold pb-xl">
      Don hang khong ton tai
    </div>
  </template>
</template>