import { Router } from "express";
import { getAllVouchers, getVoucherById, createVoucher, updateVoucher, deleteVoucher, toggleActiveVoucher, } from "../../../controllers/v1/admin/voucher.controller.js";
import { authenticateAdmin } from '../../../middlewares/authenticate-admin.js';
const router = Router();
router.get("/", authenticateAdmin, getAllVouchers);
router.get("/:id", authenticateAdmin, getVoucherById);
router.post("/", authenticateAdmin, createVoucher);
router.put("/:id", authenticateAdmin, updateVoucher);
router.delete("/:id", authenticateAdmin, deleteVoucher);
router.patch("/:id/toggle-active", authenticateAdmin, toggleActiveVoucher);
export default router;
//# sourceMappingURL=voucher.router.js.map