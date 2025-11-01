import { Router } from "express";
import { applyVoucher, getAvailableVouchers, getAllVouchers } from "../../controllers/v1/voucherController.js";
import { authenticate } from '../../middlewares/authenticate.js';
const router = Router();
router.post('/', getAvailableVouchers);
router.get('/all', getAllVouchers);
router.post("/apply", authenticate, applyVoucher);
export default router;
//# sourceMappingURL=voucherRouter.js.map