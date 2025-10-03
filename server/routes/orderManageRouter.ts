import { Router } from 'express'
import {
  getAllOrder,
  getOrderById,
  createOrder,
  deleteOrder,
  getAllStatus,
  getAllPayment,
  getOrdersByUserId,
  updateOrderStatus,
  getRewardHistoryByUserId,
  checkPoint,
} from '../controllers/orderController.js'

const router = Router()

router.get('/',          getAllOrder)
router.get('/status',          getAllStatus)
router.get('/payments',          getAllPayment)
router.get('/:id',       getOrderById)
router.post('/',         createOrder)
router.post("/check-point", checkPoint);
router.delete('/:id',    deleteOrder)
router.get('/users/:userId/orders', getOrdersByUserId)
router.get('/users/:userId/rewards', getRewardHistoryByUserId)
router.put('/status',               updateOrderStatus)

export default router
