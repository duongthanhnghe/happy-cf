import { Router } from "express";
import { createPaymentTransaction, updatePaymentTransactionStatus, getPaymentTransactions, deletePaymentTransaction } from '../../../controllers/v1/admin/payment-transaction.controller.js';
const router = Router();
router.post("/", createPaymentTransaction);
router.put("/status", updatePaymentTransactionStatus);
router.get("/", getPaymentTransactions);
router.delete("/:id", deletePaymentTransaction);
export default router;
//# sourceMappingURL=paymentTransactionRoutes.js.map