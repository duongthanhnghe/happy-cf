import { Router } from "express"
import {
  getAll,
  getDetail,
  updateStatus
} from '../../../controllers/v1/admin/payment-transaction.controller'
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'

const router = Router()

router.get("/", authenticateAdmin, getAll)
router.put("/update-status", authenticateAdmin, updateStatus)
router.get("/:id", authenticateAdmin, getDetail)

export default router
