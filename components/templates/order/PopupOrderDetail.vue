<script lang="ts" setup>
import {
  useOrderHistoryStore
} from '@/stores/client/order/useOrderHistoryStore'

const storeHistory = useOrderHistoryStore()

const props = defineProps({
  typePopup: {
    type: Boolean,
    default: false
  },
  idOrder: {
    type: String,
    default: ''
  }
});

</script>
<template>
<Popup :children="props.typePopup" popupId="popup-detail-order" v-model="storeHistory.isTogglePopupDetail" bodyClass="bg-gradient-1 pb-md" align="right">
  <template #body>
    <OrderItemDetailTemplate1 :idOrder="props.idOrder" />
  </template>
</Popup>
</template>