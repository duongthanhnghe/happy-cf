import { Router } from "express"
import {
  getAllVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  toggleActiveVoucher,
} from "../../../controllers/v1/admin/voucher.controller"
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'
import { validate } from '../../../middlewares/validate/validate'
import { createVoucherSchema, updateVoucherSchema, voucherIdParamSchema } from '../../../../shared/validate/schemas/voucher.schema'

const router = Router()

router.get("/", authenticateAdmin, getAllVouchers)
router.get("/:id", authenticateAdmin, validate(voucherIdParamSchema, 'params'), getVoucherById)
router.post("/", authenticateAdmin, validate(createVoucherSchema), createVoucher)
router.put("/:id", authenticateAdmin, validate(updateVoucherSchema), updateVoucher)
router.delete("/:id", authenticateAdmin, validate(voucherIdParamSchema, 'params'), deleteVoucher)
router.patch("/:id/toggle-active", authenticateAdmin, validate(voucherIdParamSchema, 'params'), toggleActiveVoucher)

export default router
