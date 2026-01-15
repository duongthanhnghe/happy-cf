<script lang="ts" setup>
import { useAdminOrderDetailStore } from '@/stores/admin/order/useOrderDetailStore';
import { useOrderManageStore } from '@/stores/admin/order/useOrderManageStore';

const storeDetailOrder = useAdminOrderDetailStore()
const store = useOrderManageStore()

</script>
<template>
<Popup v-model="storeDetailOrder.togglePopupDetail" :popupHeading="`Đơn hàng: ${storeDetailOrder.getDetailOrder?.code}`" variant="modal-full-screen" bodyClass="bg-gray2 pb-md" align="right">
  <template #header v-if="storeDetailOrder.getDetailOrder">
    <Button v-tooltip.left="'In bill'" color="secondary" icon="receipt" @click="store.handlePrintBill(storeDetailOrder.getDetailOrder?.id)" />
    <Button v-tooltip.left="'Xoá đơn hàng'" color="secondary" icon="delete" @click="store.handleDelete(storeDetailOrder.getDetailOrder?.id)" />
  </template>
  <template #body>
    <AdminOrderDetailTemplate />
  </template>
</Popup>
</template>