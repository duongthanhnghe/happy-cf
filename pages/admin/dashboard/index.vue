<script lang="ts" setup>
import { ROUTES } from '@/shared/constants/routes'
import { watch } from 'vue'
import { useDashboard } from '@/composables/admin/dashboard/useDashboard'
import { useDashboardFilter } from '@/composables/admin/dashboard/useDashboardFilter'

definePageMeta({
  layout: ROUTES.ADMIN.BASE_INFORMATION.layout,
  middleware: ROUTES.ADMIN.BASE_INFORMATION.middleware,
})

const {
  fetchDashboardAll,
  getSummary,
  getRevenueChart,
  getOrderStatus,
  getShippingStatus,
  getCustomerMembership,
  isLoading,
} = useDashboard()

const {
  selectedRange,
  fromDay,
  toDay,
  DASHBOARD_RANGES,
  dateParams,
} = useDashboardFilter()

watch(
  dateParams,
  (params) => fetchDashboardAll(params),
  { immediate: true }
)
</script>

<template>
  <HeaderAdmin>
  <template #left>
     <v-select
        v-model="selectedRange"
        :items="DASHBOARD_RANGES"
        item-title="label"
        item-value="key"
        label="Thời gian"
        prepend-inner-icon="mdi-calendar-range"
        density="compact"
        variant="outlined"
        hide-details
        :disabled="isLoading"
      />

      <DateFilter
        v-model:fromDay="fromDay"
        v-model:toDay="toDay"
      />
    </template>
  </HeaderAdmin>

  <v-container class="pb-xl overflow-hidden">
    <Heading text="Dashboard" size="xl" />
    <div class="mb-md">
      <SummaryChart :data="getSummary" /> 
    </div>
    <div class="row row-sm has-control">
      <div class="col-12 col-md-6">
        <Card size="md" class="rd-xl height-full" heading="Doanh thu" bg="white" >
          <RevenueChart :data="getRevenueChart" />
        </Card>
      </div>
      <div class="col-12 col-md-6">
        <Card size="md" class="rd-xl height-full" heading="T/T Đơn hàng" bg="white">
          <OrderStatusChart :data="getOrderStatus" />
        </Card>
      </div>
      <div class="col-12 col-md-6">
        <Card size="md" class="rd-xl height-full" heading="T/T Vận đơn" bg="white">
          <ShippingStatusChart :data="getShippingStatus" />
        </Card>
      </div>

      <div class="col-12 col-md-6">
        <Card size="md" class="rd-xl height-full" heading="Membership" bg="white">
          <CustomerMembershipChart :data="getCustomerMembership" />
        </Card>
      </div>

    </div>
  </v-container>
</template>
