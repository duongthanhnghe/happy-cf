import { Router } from "express"
import {
  getAllVouchers,
  getVoucherById,
  createVoucher,
  updateVoucher,
  deleteVoucher,
  applyVoucher,
  toggleActiveVoucher
} from "../../../controllers/v1/admin/voucherController"

const router = Router()

router.get("/", getAllVouchers)
router.get("/:id", getVoucherById)
router.post("/", createVoucher)
router.put("/:id", updateVoucher)
router.delete("/:id", deleteVoucher)
router.patch("/:id/toggle-active", toggleActiveVoucher)
router.post("/apply", applyVoucher)

export default router
