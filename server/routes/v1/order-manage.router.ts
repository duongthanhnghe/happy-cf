import { Router } from 'express'
import {
  // getAllOrder,
  getOrderById,
  createOrder,
  // deleteOrder,
  // getAllStatus,
  // getAllPayment,
  getOrdersByUserId,
  // updateOrderStatus,
  getRewardHistoryByUserId,
  checkPoint,
  sepayCallback,
  getShippingFee,
} from '../../controllers/v1/order.controller'
import { authenticate } from '../../middlewares/authenticate'

const router = Router()

// router.get('/',          getAllOrder)
// router.get('/status',          getAllStatus)
// router.get('/payments',          getAllPayment)
router.get('/:id',       getOrderById)
router.post('/',         createOrder)
router.post("/check-point", authenticate, checkPoint);
router.post("/sepay-callback", sepayCallback);
router.post("/shipping/fee", getShippingFee);
// router.delete('/:id',    deleteOrder)
router.get('/users/:userId/orders', authenticate, getOrdersByUserId)
router.get('/users/:userId/rewards', authenticate, getRewardHistoryByUserId)
// router.put('/status',               updateOrderStatus)


export default router
