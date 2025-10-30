import { Router } from "express"
import {
  applyVoucher,
  getAvailableVouchers
} from "../../controllers/v1/voucherController"
import { authenticate } from '../../middlewares/authenticate'

const router = Router()

router.post('/', getAvailableVouchers)
router.post("/apply", authenticate, applyVoucher)

export default router
