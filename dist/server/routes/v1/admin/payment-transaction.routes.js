import { Router } from "express";
import { createPaymentTransaction, updatePaymentTransactionStatus, getPaymentTransactions, deletePaymentTransaction } from '../../../controllers/v1/admin/payment-transaction.controller.js';
import { authenticateAdmin } from '../../../middlewares/authenticate-admin.js';
const router = Router();
router.post("/", authenticateAdmin, createPaymentTransaction);
router.put("/status", authenticateAdmin, updatePaymentTransactionStatus);
router.get("/", authenticateAdmin, getPaymentTransactions);
router.delete("/:id", authenticateAdmin, deletePaymentTransaction);
export default router;
//# sourceMappingURL=payment-transaction.routes.js.map