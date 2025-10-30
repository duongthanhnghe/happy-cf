<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes';
import { useOrderHistoryStore } from '@/stores/client/order/useOrderHistoryStore';
definePageMeta({
  layout: ROUTES.PUBLIC.ACCOUNT.layout,
  headerTypeLeft: ROUTES.PUBLIC.ACCOUNT.headerTypeLeft,
  middleware: ROUTES.PUBLIC.ACCOUNT.middleware,
})

const store = useOrderHistoryStore();

if(!store.getItems) store.getApiData();
</script>
<template>
  <ListOrderHistory />
</template>