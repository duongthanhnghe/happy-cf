<script setup lang="ts">
import { computed } from 'vue'
import type { DashboardSummaryDTO } from '@/server/types/dto/v1/dashboard.dto'
import { formatCurrency } from '@/utils/global';
import { useDisplayStore } from '@/stores/shared/useDisplayStore';

const props = defineProps<{
  data: DashboardSummaryDTO | null
}>()

const storeDisplay = useDisplayStore()

const items = computed(() => {
  if (!props.data) return []

  const d = props.data

  return [
    // Orders
    {
      key: 'totalRevenue',
      title: 'Doanh thu',
      value: formatCurrency(d.totalRevenue),
      icon: 'payments',
      color: 'warning',
      col: 'col-12 col-md-3'
    },
    {
      key: 'totalOrders',
      title: 'Tổng đơn hàng',
      value: d.totalOrders,
      icon: 'shopping_cart',
      color: 'primary',
    },
    {
      key: 'completionRate',
      title: 'Tỷ lệ hoàn thành',
      value: `${d.completionRate}%`,
      sub: `${d.completedOrders} đơn`,
      icon: 'task_alt',
      color: 'success',
    },
    {
      key: 'cancelRate',
      title: 'Tỷ lệ huỷ',
      value: `${d.cancelRate}%`,
      sub: `${d.cancelledOrders} đơn`,
      icon: 'cancel',
      color: 'error',
    },
      {
      key: 'ordersPerCustomer',
      title: 'Đơn / khách',
      value: d.ordersPerCustomer,
      sub: 'Mức độ gắn bó',
      icon: 'insights',
      color: 'deep-purple',
    },
    // Revenue
    {
      key: 'avgOrderValue',
      title: 'Giá trị TB / đơn',
      value: formatCurrency(d.avgOrderValue),
      icon: 'receipt_long',
      color: 'info',
      col: 'col-12 col-md-3'
    },
    {
      key: 'revenueGrowth',
      title: 'Tăng trưởng',
      value: `${d.revenueGrowth}%`,
      sub: 'So với kỳ trước',
      icon: d.revenueGrowth >= 0 ? 'trending_up' : 'trending_down',
      color: d.revenueGrowth >= 0 ? 'success' : 'error',
    },

    // Customers
    {
      key: 'totalCustomers',
      title: 'Khách đăng ký mới',
      value: d.totalCustomers,
      icon: 'group',
      color: 'primary',
    },
    {
      key: 'newCustomers',
      title: 'Khách mua lần đầu',
      value: d.newCustomers,
      icon: 'group',
      color: 'primary',
    },
    {
      key: 'activeCustomers',
      title: 'Khách có giao dịch',
      value: d.activeCustomers,
      icon: 'group',
      color: 'primary',
    },
    {
      key: 'repeatCustomers',
      title: 'Khách quay lại',
      value: d.repeatCustomers,
      sub: `${d.newCustomersRate}% khách mới`,
      icon: 'repeat',
      color: 'teal',
    },
    {
  key: 'conversionRate',
  title: 'Tỷ lệ chuyển đổi',
  value: `${d.conversionRate}%`,
  sub: 'Đăng ký → mua hàng',
  icon: 'published_with_changes',
  color: d.conversionRate >= 30 ? 'success' : 'warning',
},
      
  ]
})

</script>
<template>
  <div class="row row-xs has-control">
    <div
      v-for="item in items"
      :key="item.key"
      :class="item.col ? item.col : 'col-6 col-md-3'"
    >
      <Card class="rd-xl height-full" shadow>
        <div class="flex gap-xs justify-between">
          <div>
            <Text
              color="gray5"
              :size="storeDisplay.isLaptop ? 'normal':'base'"
              :text="item.title"
              class="mb-ms"
            />
          </div>

          <div class="min-width-50 width-50 height-50 flex align-center justify-center position-relative">
            <div
              class="height-full width-full position-absolute left-0 top-0 opacity-per30 rd-xl"
              :class="`bg-${item.color}`"
            />
            <MaterialIcon
              :name="item.icon"
              class="position-relative"
              :class="`text-${item.color}`"
              size="xl"
              weight="light"
            />
          </div>
        </div>
        
        <div class="flex align-end gap-xs">
          <Text
            color="black"
            size="xl"
            weight="medium"
            class="line-height-1"
            :text="item.value"
          />

          <Text
            v-if="item.sub"
            color="primary"
            :size="storeDisplay.isLaptop ? 'base':'xs'"
            class="line-height-1d2"
            :text="item.sub"
          />
        </div>
      </Card>
    </div>
  </div>
</template>