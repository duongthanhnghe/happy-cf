<script lang="ts" setup>
import '@/styles/molecules/order/order-item-detail-template1.scss'
import { ref, computed, watch } from 'vue'
import {
  useOrderHistoryStore
} from '@/stores/client/order/useOrderHistoryStore'
import {
  formatCurrency
} from '@/utils/global'
import { useOrderDetail } from "@/composables/order/useOrderDetail";
import { ORDER_STATUS } from "@/shared/constants/order-status"
import { useSettingStore } from '@/stores/shared/setting/useSettingStore';
import { useOrderStatusStore } from '@/stores/shared/useOrderStatusStore';
import { useLocation } from "@/composables/product/useLocation"

const { getDetailOrder, fetchOrderDetail } = useOrderDetail();
const storeHistory = useOrderHistoryStore();
const storeOrderStatus = useOrderStatusStore();
const storeSetting = useSettingStore();
const { 
  fetchProvinceDetail, 
  fetchDistrictDetail, 
  fetchWardDetail, 
  getProvinceDetail, 
  getDistrictDetail, 
  getWardDetail 
} = useLocation();

const props = defineProps({
  idOrder: {
    type: String,
    default: ''
  },
});
const elCurrent = ref(ORDER_STATUS.PENDING)

const activeIndex = computed(() => {
  return storeOrderStatus.getListData.findIndex(item => item.id === elCurrent.value)
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

watch(
  () => getDetailOrder.value,
  (val) => {
    if (val) {
      if (val.provinceCode) fetchProvinceDetail(val.provinceCode)
      if (val.districtCode) fetchDistrictDetail(val.districtCode)
      if (val.wardCode) fetchWardDetail(val.wardCode, val.districtCode)
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
    <div v-if="getDetailOrder.status.id !== ORDER_STATUS.CANCELLED" class="flex justify-between mt-xl mb-md">
      <div v-for="(items, index) in storeOrderStatus.getListData.filter(i => i.id !== ORDER_STATUS.CANCELLED)" :key="items.id" :class="{ 'is-active': index <= activeIndex }" class="flex-1 text-center text-color-white popup-detail-order-status-item">
        <div class="avatar-src popup-detail-order-status-icon m-auto">
          <MaterialIcon size="26" :name="items.icon"/>
        </div>
        <div class="mt-sm popup-detail-order-status-title">
          {{ items.name }}
        </div>
      </div>
    </div>
    <div v-else class="flex justify-between mt-md mb-md">
      <div class="is-active flex-1 text-center text-color-white popup-detail-order-status-item">
        <div class="avatar-src popup-detail-order-status-icon m-auto">
          <MaterialIcon size="26" name="close"/>
        </div>
        <div class="mt-sm popup-detail-order-status-title">
          {{ getDetailOrder.status.name }}
        </div>
      </div>
    </div>
    
    <div class="card-sm bg-white">
      <div class="flex justify-between">
        <span class="flex gap-xs align-center weight-semibold text-color-black">
          <Button size="xs" color="secondary" icon="location_on" :disable="true"/>
          {{ getDetailOrder?.address }},
          {{ getWardDetail?.name }},
          {{ getDistrictDetail?.name }},
          {{ getProvinceDetail?.name }}
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
      <div class="flex flex-direction-column gap-xs mt-xs">
      <div class="flex justify-between text-size-normal mt-sm weight-medium line-height1">
        <div class="flex align-center gap-xs">
          Tong cong
          <span v-if="getDetailOrder?.totalPriceSave && getDetailOrder?.totalPriceSave !== 0" class="text-size-base text-color-green">(Tiet kiem: {{ formatCurrency(getDetailOrder?.totalPriceSave) }})</span>
        </div>
        <div class="weight-semibold text-color-danger text-right mb-xs">
          {{ formatCurrency(getDetailOrder?.totalPrice) }}
        </div>
      </div>
      <div class="flex justify-between text-color-gray5">
        Don hang
        <span>
          {{ formatCurrency(getDetailOrder?.totalPriceCurrent) }}
        </span>
      </div>
      <div v-if="getDetailOrder?.shippingFee" class="flex justify-between text-color-gray5">
        Phi van chuyen
        <span>
          {{ formatCurrency(getDetailOrder?.shippingFee) }}
        </span>
      </div>
      <div v-if="getDetailOrder?.totalDiscountOrder && getDetailOrder?.totalDiscountOrder != 0" class="flex justify-between text-color-gray5">
        Giam don hang <span>-{{ formatCurrency(getDetailOrder?.totalDiscountOrder) }}</span>
      </div>
      <div v-if="getDetailOrder?.usedPoints !== 0" class="flex justify-between text-color-gray5">
        Diem thanh vien
        <span>
          -{{ formatCurrency(getDetailOrder?.usedPoints) }}
        </span>
      </div>
      <div v-if="getDetailOrder?.membershipDiscountAmount !== 0" class="flex justify-between text-color-gray5">
        Uu dai thanh vien
        <span>
          -{{ formatCurrency(getDetailOrder?.membershipDiscountAmount) }}
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
          Chua thanh toan
        </v-chip>
      </div>
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
    <div class="text-center mt-sm">
      Dat luc: {{ getDetailOrder?.createdAt }}
    </div>
  </template>
  <template v-else>
    <div class="text-center text-color-white text-size-large weight-semibold pb-xl">
      Don hang khong ton tai
    </div>
  </template>
</template>