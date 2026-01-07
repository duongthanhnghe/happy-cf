<script lang="ts" setup>
import { useSharedOrderDetailStore } from '@/stores/shared/order/useSharedOrderDetailStore';
const storeDetailOrder = useSharedOrderDetailStore()
</script>
<template>
  <Popup v-model="storeDetailOrder.togglePopupDetail" popupHeading="Chi tiết" bodyClass="bg-gradient-1 pb-md" align="right">
    <template #body>
      <OrderDetailTemplate />
    </template>
  </Popup>
</template>