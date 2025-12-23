import { Router } from "express";
import { getAllVoucherUsage, } from "../../../controllers/v1/admin/voucher-usage.controller.js";
import { authenticateAdmin } from '../../../middlewares/authenticate-admin.js';
const router = Router();
router.get("/", authenticateAdmin, getAllVoucherUsage);
export default router;
//# sourceMappingURL=voucher-usage.router.js.map