import { Router } from "express";
import { getAllVoucherUsage, } from "../../../controllers/v1/admin/voucher-usage.controller.js";
const router = Router();
router.get("/", getAllVoucherUsage);
export default router;
//# sourceMappingURL=voucher-usage.router.js.map