import { Router } from "express"
import {
  createPaymentTransaction,
  updatePaymentTransactionStatus,
  getPaymentTransactions,
  deletePaymentTransaction
} from '../../../controllers/v1/admin/paymentTransactionController'

const router = Router()

router.post("/", createPaymentTransaction)
router.put("/status", updatePaymentTransactionStatus) 
router.get("/", getPaymentTransactions)
router.delete("/:id", deletePaymentTransaction)

export default router
