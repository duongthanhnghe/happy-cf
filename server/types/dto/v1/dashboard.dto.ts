import type { OrderStatusDTO } from "./order.dto"
import type { MembershipLevel } from "./user.dto"

export interface DashboardSummaryDTO {
  // raw
  totalOrders: number
  completedOrders: number
  cancelledOrders: number
  totalRevenue: number

  totalCustomers: number
  activeCustomers: number
  repeatCustomers: number
  newCustomers: number

  avgOrderValue: number
  completionRate: number
  cancelRate: number

  revenuePerOrder: number
  revenueGrowth: number

  newCustomersRate: number

  conversionRate: number

  ordersPerCustomer: number
}


export interface RevenueChartDTO {
  _id: string 
  revenue: number
  orders: number
}

export interface StatusCountDTO extends OrderStatusDTO {
  count: number
}

export interface MembershipCountDTO {
  level: MembershipLevel
  count: number
}