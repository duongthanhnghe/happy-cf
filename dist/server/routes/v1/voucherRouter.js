import { Router } from "express";
import { applyVoucher, getAvailableVouchers } from "../../controllers/v1/voucherController.js";
const router = Router();
router.post('/', getAvailableVouchers);
router.post("/apply", applyVoucher);
export default router;
//# sourceMappingURL=voucherRouter.js.map