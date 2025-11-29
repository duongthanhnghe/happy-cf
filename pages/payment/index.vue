<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { onMounted, onBeforeUnmount } from 'vue'
import { downloadImage, formatCurrency } from '@/utils/global'
import { usePaymentOrderStore } from '@/stores/client/product/usePaymentOrderStore'
import { ROUTES } from '@/shared/constants/routes';
import { useRuntimeConfig } from 'nuxt/app';

definePageMeta({
  middleware: ROUTES.PUBLIC.PAYMENT.middleware,
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
  <div class="bg-gray2 min-height-dvh" v-if="route.query.orderId && route.query.amount && route.query.orderCode && store.qrCodeUrl">
    <div class="container">
      <BreadcrumbDefault />
      <Card size="md" class="rd-xl max-width-800 m-auto">
        <Text text="QR Thanh toán đơn hàng" color="black" size="lg" weight="semibold" align="center" class="text-uppercase" />
        <Text text="Vui lòng kiểm tra số tiền cần thanh toán trước khi chuyển khoản" color="gray8" align="center" class="mt-xs" />
        <div class="row row-xs align-center ">
          <div class="col-12 col-lg-6">
            <div class="mt-ms">
              <LoadingData v-if="store.qrCodeUrl === ''"/>
              <img v-else :src="store.qrCodeUrl" :alt="store.qrCodeUrl" />
            </div>
          </div>
          <div class="col-12 col-lg-6">
            <Card size="sm" bg="gray6" class="rd-lg shadow-1" border>
              <div class="flex gap-sm justify-between mb-xs">
                <Text text="Số tài khoản" color="gray5" />
                <Text :text="config.public.sepayAccountNo" color="black" weight="semibold" />
              </div>
              <div class="flex gap-sm justify-between mb-xs">
                <Text text="Tên tài khoản" color="gray5" />
                <Text :text="config.public.sepayAccountName" color="black" weight="semibold" />
              </div>
              <div class="flex gap-sm justify-between">
                <Text text="Tên ngân hàng" color="gray5" class="white-space" />
                <Text :text="config.public.sepayBankName" color="black" weight="semibold" align="right" class="text-uppercase" />
              </div>
            </Card>
            <Card size="sm" bg="gray6" class="rd-lg shadow-1 mt-sm" border>
              <div class="flex gap-sm justify-between mb-xs">
                <Text text="Số tiền" color="gray5" />
                <Text :text="formatCurrency(route.query.amount)" color="black" weight="semibold" />
              </div>
              <div class="flex gap-sm justify-between mb-xs">
                <Text text="Mã đơn hàng" color="gray5" />
                <Text :text="route.query.orderCode" color="black" weight="semibold" />
              </div>
              <div class="flex gap-sm justify-between">
                <Text text="Nội dung thanh toán" color="gray5" />
                <Text :text="route.query.orderCode" color="black" weight="semibold" />
              </div>
            </Card>
          </div>
        </div>
      </Card>
      <div class="flex justify-center mt-ms pb-md">
        <Button
          color="black"
          icon="download"
          label="Tải xuống QR"
          @click.prevent="downloadImage(store.qrCodeUrl)"
        />
      </div>
    </div>
  </div>
  <NoData v-else />
</template>