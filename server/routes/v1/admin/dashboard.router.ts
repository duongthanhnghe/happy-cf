import { Router } from "express"
import {
  getDashboardSummary,
  getRevenueChart,
  getOrderStatusChart,
  getShippingStatusChart,
  getCustomerMembershipChart,
} from "../../../controllers/v1/admin/dashboard.controller"
import { authenticateAdmin } from "../../../middlewares/authenticate-admin"

const router = Router()

router.get("/summary", authenticateAdmin, getDashboardSummary)

router.get("/revenue-chart", authenticateAdmin, getRevenueChart)

router.get("/order-status", authenticateAdmin, getOrderStatusChart)

router.get("/shipping-status", authenticateAdmin, getShippingStatusChart)

router.get("/customer-membership", authenticateAdmin, getCustomerMembershipChart)

export default router
