<script lang="ts" setup>
// import '@/styles/templates/cart/popup-cart.scss'
import { useRoute } from 'vue-router'
import { onMounted, onBeforeUnmount } from 'vue'
import { formatCurrency } from '@/utils/global'
import { usePaymentOrderStore } from '@/stores/client/product/usePaymentOrderStore'
import { ROUTES } from '@/shared/constants/routes';

definePageMeta({
  headerTypeLeft: ROUTES.PUBLIC.ORDER_TRACKING.headerTypeLeft,
})

const config = useRuntimeConfig()
const route = useRoute()
const store = usePaymentOrderStore();

onMounted(() => {
  const orderId = route.query.orderId as string
  const orderCode = route.query.orderCode as string
  const amount = route.query.amount as string

  if (orderId && orderCode && amount) {
    store.handleSepayPayment(orderId, orderCode, amount)
  } else {
    store.clearPaymentCheck()
  }
})

onBeforeUnmount(() => {
  store.clearPaymentCheck()
})

</script>
<template>

  <div class="bg-gray2">
    <div class="container pb-section">
      <BreadcrumbDefault />

      <div v-if="route.query.orderId && route.query.amount && route.query.orderCode && store.qrCodeUrl">
        <div>
          <img :src="store.qrCodeUrl" alt="qrcode" />
        </div>
        {{ route.query.orderId }}
        {{ route.query.orderCode }}
        {{ formatCurrency(route.query.amount) }}
        <div>
          {{ config.public.sepayAccountNo }}
          {{ config.public.sepayBankId }}
          {{ config.public.sepayAccountName }}
        </div>
      </div>
    </div>
  </div>

</template>