import { apiAdmin } from "@/services/http/apiAdmin"
import { API_ENDPOINTS_ADMIN } from "@/services/const/api-endpoints-admin"
import type { ApiResponse } from "@/server/types/common/api-response"
import type {
  DashboardSummaryDTO,
  MembershipCountDTO,
  RevenueChartDTO,
  StatusCountDTO,
} from "@/server/types/dto/v1/dashboard.dto"
import { apiError } from "@/server/types/common/api-response"

interface DashboardDateParams {
  fromDate?: string
  toDate?: string
}

export const dashboardAPI = {
  /** KPI summary */
  getSummary: async (
    params?: DashboardDateParams
  ): Promise<ApiResponse<DashboardSummaryDTO>> => {
    try {
      return await apiAdmin().get(
        API_ENDPOINTS_ADMIN.DASHBOARD.SUMMARY,
        params
      )
    } catch (err: any) {
      console.error("Error fetching dashboard summary:", err)
      return apiError(err)
    }
  },

  /** Revenue chart */
  getRevenueChart: async (
    params?: DashboardDateParams
  ): Promise<ApiResponse<RevenueChartDTO[]>> => {
    try {
      return await apiAdmin().get(
        API_ENDPOINTS_ADMIN.DASHBOARD.REVENUE_CHART,
        params
      )
    } catch (err: any) {
      console.error("Error fetching revenue chart:", err)
      return apiError(err)
    }
  },

  /** Order status chart */
  getOrderStatusChart: async (
    params?: DashboardDateParams
  ): Promise<ApiResponse<StatusCountDTO[]>> => {
    try {
      return await apiAdmin().get(
        API_ENDPOINTS_ADMIN.DASHBOARD.ORDER_STATUS_CHART,
        params
      )
    } catch (err: any) {
      console.error("Error fetching order status chart:", err)
      return apiError(err)
    }
  },

  /** Shipping status chart */
  getShippingStatusChart: async (
    params?: DashboardDateParams
  ): Promise<ApiResponse<StatusCountDTO[]>> => {
    try {
      return await apiAdmin().get(
        API_ENDPOINTS_ADMIN.DASHBOARD.SHIPPING_STATUS_CHART,
        params
      )
    } catch (err: any) {
      console.error("Error fetching shipping status chart:", err)
      return apiError(err)
    }
  },

  getCustomerMembershipChart: async (
    params?: DashboardDateParams
  ): Promise<ApiResponse<MembershipCountDTO[]>> => {
    try {
      return await apiAdmin().get(
        API_ENDPOINTS_ADMIN.DASHBOARD.CUSTOMER_MEMBERSHIP,
        params
      )
    } catch (err: any) {
      console.error("Error fetching shipping status chart:", err)
      return apiError(err)
    }
  },

}
