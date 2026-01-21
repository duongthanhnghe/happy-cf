<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ROUTES } from '@/shared/constants/routes';
import { onMounted } from 'vue';
import { useSharedOrderDetailStore } from '@/stores/client/order/useSharedOrderDetailStore';

definePageMeta({
  middleware: ROUTES.PUBLIC.ORDER.middleware,
  showBreadcrumb: ROUTES.PUBLIC.ORDER.showBreadcrumb,
})

const route = useRoute()
const idOrder = route.params.id as string
const storeDetailOrder = useSharedOrderDetailStore()

onMounted(async () => {
  await storeDetailOrder.fetchOrderDetail(idOrder)
})
</script>
<template>
  <div class="bg-gradient-1 pb-md pt-md">
    <div class="container">
      <OrderDetailTemplate />
    </div>
  </div> 
</template>