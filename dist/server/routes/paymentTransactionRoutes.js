import { Router } from "express";
import { createPaymentTransaction, updatePaymentTransactionStatus, getPaymentTransactions, deletePaymentTransaction } from "../controllers/paymentTransactionController.js";
const router = Router();
router.post("/", createPaymentTransaction); // tạo giao dịch
router.put("/status", updatePaymentTransactionStatus); // update status
router.get("/", getPaymentTransactions); // lấy danh sách
router.delete("/:id", deletePaymentTransaction); // xóa
export default router;
//# sourceMappingURL=paymentTransactionRoutes.js.map