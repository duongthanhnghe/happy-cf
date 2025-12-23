import { Router } from "express"
import {
  getAllVoucherUsage,
} from "../../../controllers/v1/admin/voucher-usage.controller"
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'

const router = Router()

router.get("/", authenticateAdmin, getAllVoucherUsage)

export default router
