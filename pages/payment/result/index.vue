<script lang="ts" setup>
import { useRoute } from 'vue-router'
import { ROUTES } from '@/shared/constants/routes';
import { usePaymentTransactionDetail } from '@/composables/payment-transaction/usePaymentTransactionDetail';
import { formatCurrency, formatDateTime } from '@/utils/global'
import { computed } from 'vue';
import MaterialIcon from '@/components/atoms/MaterialIcon.vue';

definePageMeta({
  middleware: ROUTES.PUBLIC.PAYMENT_RESULT.middleware,
  showBreadcrumb: ROUTES.PUBLIC.PAYMENT_RESULT.showBreadcrumb,
  containerClass: 'bg-gray2',
})

const route = useRoute()
const transactionId = route.query.transactionId as string
const status = route.query.status as string

const { getDetail, fetchDetailTransaction } = usePaymentTransactionDetail()

if(transactionId) await fetchDetailTransaction(transactionId)

const headingInfo = computed(() => {
  const detail = getDetail.value
  if (!detail) return null

  if (detail.status === 'paid') {
    return {
      text: 'Thanh toán thành công',
      icon: 'check_circle',
      color: 'green'
    }
  }

  return {
    text: 'Hóa đơn thanh toán',
    icon: 'error',
    color: 'orange'
  }
})

const paymentDescription = computed(() => {
  const d = getDetail.value
  if (!d) return ''

  switch (d.status) {
    case 'paid':
      return `Thanh toán cho đơn hàng ${d.orderCode} đã hoàn tất thành công.`

    case 'failed':
      return `Thanh toán cho đơn hàng ${d.orderCode} không thành công.
Vui lòng thử lại hoặc chọn phương thức khác.`

    default:
      return `Đơn hàng ${d.orderCode} đang chờ thanh toán.
Vui lòng kiểm tra và hoàn tất thanh toán để tiếp tục.`
  }
})

</script>

<template>
  <div class="pt-section pb-section" v-if="route.query.transactionId && getDetail && status === 'success'">
    <div class="container">
      <Card size="md" class="rd-xl max-width-600 m-auto mt-xl">
        <div v-if="headingInfo" :class="`width-100 height-100 rd-full bg-${headingInfo?.color} flex justify-center align-center m-auto shadow-1`" style="margin-top: -80px;">
          <MaterialIcon :name="headingInfo?.icon" color="white" weight="light" style="font-size: 70px"/>
        </div>        

        <Text :text="headingInfo?.text" color="black" size="lg" weight="semibold" align="center" class="text-uppercase mt-ms" />
        <Text :text="paymentDescription" color="gray8" align="center" class="mt-xs" />
       
        <Text text="Chi tiết thanh toán" color="black" size="normal" weight="semibold" class="mt-md" />
        
        <div class="flex gap-sm justify-between mt-sm">
          <Text text="Mã giao dịch" color="gray5" />
          <Text :text="getDetail.id" color="black" weight="semibold" />
        </div>
        <div class="flex gap-sm justify-between mt-sm">
          <Text text="Mã đơn hàng" color="gray5" />
          <Text :text="getDetail.orderCode" color="black" weight="semibold" />
        </div>
        <div class="flex gap-sm justify-between mt-sm">
          <Text text="Phương thức thanh toán" color="gray5" />
          <Text :text="getDetail.method" color="black" weight="semibold" class="text-uppercase"/>
        </div>
        <div class="flex gap-sm justify-between mt-sm">
          <Text text="Trạng thái thanh toán" color="gray5" />
          <v-chip :color="getDetail.statusColor">
            {{ getDetail.statusText }}
          </v-chip>
        </div>
        <div v-if="getDetail.paidAt" class="flex gap-sm justify-between mt-sm">
          <Text text="Thời gian thanh toán" color="gray5" />
          <Text :text="formatDateTime(getDetail.paidAt)" color="black" weight="semibold" />
        </div>
        <div class="flex gap-sm justify-between mt-sm border-top-default border-color-gray2 pt-ms">
          <Text text="Tổng số tiền thanh toán" color="gray5" />
          <Text :text="formatCurrency(getDetail.amount)" color="black" weight="semibold" />
        </div>
     
      </Card>
      <div class="flex justify-center mt-md">
         <NuxtLink
          :to="{ path: `${ROUTES.PUBLIC.ORDER_TRACKING.path}/${getDetail.orderId}` }"
        >
          <Button
            tag="div"
            color="black"
            icon="package_2"
            label="Chi tiết đơn hàng"
          />
        </NuxtLink>
      </div>
    </div>
  </div>
  <div class="pt-section pb-section" v-else>
    <div class="container">
      <Card size="md" class="rd-xl max-width-600 m-auto mt-xl">
        <div :class="`width-100 height-100 rd-full bg-orange flex justify-center align-center m-auto`" style="margin-top: -80px;">
          <MaterialIcon name="error" color="white" weight="light" style="font-size: 70px"/>
        </div>        
        <Text text="Thanh toán thất bại" color="black" size="lg" weight="semibold" align="center" class="text-uppercase mt-ms" />
        <Text text="Vui lòng thử lại hoặc chọn phương thức khác" color="gray8" align="center" class="mt-xs" />
      </Card>
    </div>
  </div>
</template>