import { Router } from "express";
import { getAllVoucherUsage, } from "../../../controllers/v1/admin/voucherUsageController.js";
const router = Router();
router.get("/", getAllVoucherUsage);
export default router;
//# sourceMappingURL=voucherUsageRouter.js.map