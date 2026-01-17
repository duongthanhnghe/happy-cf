import { ref, computed } from "vue"
import { dashboardAPI } from "@/services/v1/admin/dashboard.service"

import type {
  DashboardSummaryDTO,
  MembershipCountDTO,
  RevenueChartDTO,
  StatusCountDTO,
} from "@/server/types/dto/v1/dashboard.dto"

interface DashboardDateParams {
  fromDate?: string
  toDate?: string
}

export const useDashboard = () => {

  const summary = ref<DashboardSummaryDTO | null>(null)
  const revenueChart = ref<RevenueChartDTO[]>([])
  const orderStatus = ref<StatusCountDTO[]>([])
  const shippingStatus = ref<StatusCountDTO[]>([])
  const customerMembership = ref<MembershipCountDTO[]>([])
  const loading = ref(false)

  const fetchDashboardAll = async (params?: DashboardDateParams) => {
    loading.value = true

    try {
      const [
        summaryRes,
        revenueRes,
        orderStatusRes,
        shippingStatusRes,
        customerMembershipRes,
      ] = await Promise.all([
        dashboardAPI.getSummary(params),
        dashboardAPI.getRevenueChart(params),
        dashboardAPI.getOrderStatusChart(params),
        dashboardAPI.getShippingStatusChart(params),
        dashboardAPI.getCustomerMembershipChart(params),
      ])

      if (summaryRes.code === 0) summary.value = summaryRes.data
      if (revenueRes.code === 0) revenueChart.value = revenueRes.data || []
      if (orderStatusRes.code === 0) orderStatus.value = orderStatusRes.data || []
      if (shippingStatusRes.code === 0) shippingStatus.value = shippingStatusRes.data || []
      if (customerMembershipRes.code === 0) customerMembership.value = customerMembershipRes.data || []

    } catch (err) {
      console.error("Error fetchDashboardAll", err)
    } finally {
      loading.value = false
    }
  }

  return {
    fetchDashboardAll,
    getSummary: computed(() => summary.value),
    getRevenueChart: computed(() => revenueChart.value),
    getOrderStatus: computed(() => orderStatus.value),
    getShippingStatus: computed(() => shippingStatus.value),
    getCustomerMembership: computed(() => customerMembership.value),
    isLoading: computed(() => loading.value),
  }
}
