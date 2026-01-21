<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes';
import { useOrderHistoryStore } from '@/stores/client/order/useOrderHistoryStore';
import { usePaymentMethodStore } from '@/stores/client/order/usePaymentMethodStore';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';

definePageMeta({
  layout: ROUTES.PUBLIC.ACCOUNT.layout,
  middleware: ROUTES.PUBLIC.ACCOUNT.middleware,
  showHeaderSub: ROUTES.PUBLIC.ACCOUNT.showHeaderSub,
})

const store = useOrderHistoryStore();
const storeDisplay = useDisplayStore()
const storePaymentStatus = usePaymentMethodStore();

if(!store.getItems) await store.getApiData();

if (storePaymentStatus.getListData.length === 0) {
  storePaymentStatus.fetchPaymentMethodStore()
}
</script>
<template>
  <Card size="md" :bg="storeDisplay.isMobileTable ? 'gray6':'white'" :heading="ROUTES.PUBLIC.ACCOUNT.children?.ORDERS.label" :class="storeDisplay.isMobileTable ? 'pd-0':'rd-xl'">
    <ListOrderHistory />
  </Card>
</template>