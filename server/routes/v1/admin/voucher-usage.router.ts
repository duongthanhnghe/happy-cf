import { Router } from "express"
import {
  getAllVoucherUsage,
} from "../../../controllers/v1/admin/voucher-usage.controller"

const router = Router()

router.get("/", getAllVoucherUsage)

export default router
