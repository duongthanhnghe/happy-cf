<script lang="ts" setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import {
  useOrderHistoryStore
} from '@/stores/order/useOrderHistoryStore'
import { ROUTES } from '@/shared/constants/routes';

definePageMeta({
  headerTypeLeft: ROUTES.PUBLIC.ORDER_TRACKING.headerTypeLeft,
})

const route = useRoute()
const idOrder = route.params.id as string
const storeHistory = useOrderHistoryStore();

watch(() => idOrder, (newValue) => {
  if (newValue) storeHistory.setCheckPageDetail(true)
}, { immediate: true })
</script>
<template>
  <div class="bg-gradient-1 pd-md pt-md pl-sm pr-sm">
    <OrderItemDetailTemplate1 :idOrder="idOrder" />
  </div> 
</template>