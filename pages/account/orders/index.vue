<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes';
import { useOrderHistoryStore } from '@/stores/client/order/useOrderHistoryStore';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';

definePageMeta({
  layout: ROUTES.PUBLIC.ACCOUNT.layout,
  middleware: ROUTES.PUBLIC.ACCOUNT.middleware,
})

const store = useOrderHistoryStore();
const storeDisplay = useDisplayStore()

if(!store.getItems) await store.getApiData();

</script>
<template>
  <Card size="md" :bg="storeDisplay.isMobileTable ? 'gray6':'white'" :heading="ROUTES.PUBLIC.ACCOUNT.children?.ORDERS.label" :class="storeDisplay.isMobileTable ? 'pd-0':'rd-xl'">
    <ListOrderHistory />
  </Card>
</template>