<script lang="ts" setup>
import { watch } from 'vue'
import { useRoute } from 'vue-router'
import { useOrderHistoryStore } from '@/stores/client/order/useOrderHistoryStore'
import { ROUTES } from '@/shared/constants/routes';
// import { definePageMeta } from 'nuxt/dist/pages/runtime';

definePageMeta({
  middleware: ROUTES.PUBLIC.ORDER.middleware,
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
    <PopupOrderDetail :idOrder="idOrder" />
  </div> 
</template>