<script lang="ts" setup>
import { usePaymentTransactionManageStore } from '@/stores/admin/payment-tracsaction/usePaymentTransactionManageStore';
import { formatCurrency, formatDateTime } from '@/utils/global'
import { computed } from 'vue';

const store = usePaymentTransactionManageStore()

const headingInfo = computed(() => {
  const detail = store.getDetail
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
  const d = store.getDetail
  if (!d) return ''

  switch (d.status) {
    case 'paid':
      return `Thanh toán cho đơn hàng ${d.orderCode} đã hoàn tất thành công.`

    case 'failed':
      return `Thanh toán cho đơn hàng ${d.orderCode} không thành công.`

    default:
      return `Đơn hàng ${d.orderCode} đang chờ thanh toán.`
  }
})

</script>
<template>
  <Popup v-model="store.togglePopupDetail" popupHeading="Phiếu thanh toán" bodyClass="bg-gray2" align="right">
    <template #body v-if="store.getDetail">
      <Card size="md" class="rd-xl max-width-600 m-auto" style="margin-top: 60px;">
        <div v-if="headingInfo" :class="`width-100 height-100 rd-full bg-${headingInfo?.color} flex justify-center align-center m-auto shadow-1`" style="margin-top: -80px;">
          <MaterialIcon :name="headingInfo?.icon" color="white" weight="light" style="font-size: 70px"/>
        </div>        

        <Text :text="headingInfo?.text" color="black" size="lg" weight="semibold" align="center" class="text-uppercase mt-ms" />
        <Text :text="paymentDescription" color="gray8" align="center" class="mt-xs" />
       
        <Text text="Chi tiết thanh toán" color="black" size="normal" weight="semibold" class="mt-md" />
        
        <div class="flex gap-sm justify-between mt-sm">
          <Text text="Mã giao dịch" color="gray5" />
          <Text :text="store.getDetail.id" color="black" weight="semibold" />
        </div>
        <div class="flex gap-sm justify-between mt-sm">
          <Text text="Mã đơn hàng" color="gray5" />
          <Text :text="store.getDetail.orderCode" color="black" weight="semibold" />
        </div>
        <div class="flex gap-sm justify-between mt-sm">
          <Text text="Phương thức thanh toán" color="gray5" />
          <Text :text="store.getDetail.method" color="black" weight="semibold" class="text-uppercase"/>
        </div>
        <div class="flex gap-sm justify-between mt-sm">
          <Text text="Trạng thái thanh toán" color="gray5" />
          <v-chip :color="store.getDetail.statusColor">
            {{ store.getDetail.statusText }}
          </v-chip>
        </div>
        <div v-if="store.getDetail.paidAt" class="flex gap-sm justify-between mt-sm">
          <Text text="Thời gian thanh toán" color="gray5" />
          <Text :text="formatDateTime(store.getDetail.paidAt)" color="black" weight="semibold" />
        </div>
        <div class="flex gap-sm justify-between mt-sm border-top-default border-color-gray2 pt-ms">
          <Text text="Tổng số tiền thanh toán" color="gray5" />
          <Text :text="formatCurrency(store.getDetail.amount)" color="black" weight="semibold" />
        </div>
      </Card>
    </template>
  </Popup>
</template>