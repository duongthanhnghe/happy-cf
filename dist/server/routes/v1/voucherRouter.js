import { Router } from "express";
import { applyVoucher, getAvailableVouchers } from "../../controllers/v1/voucherController.js";
import { authenticate } from '../../middlewares/authenticate.js';
const router = Router();
router.post('/', getAvailableVouchers);
router.post("/apply", authenticate, applyVoucher);
export default router;
//# sourceMappingURL=voucherRouter.js.map