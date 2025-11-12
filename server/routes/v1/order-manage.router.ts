import { Router } from 'express'
import {
  getOrderById,
  createOrder,
  getOrdersByUserId,
  getRewardHistoryByUserId,
  checkPoint,
  sepayCallback,
  getShippingFee,
  cancelOrderByUser,
} from '../../controllers/v1/order.controller'
import { authenticate } from '../../middlewares/authenticate'

const router = Router()

router.get('/:id',       getOrderById)
router.post('/',         createOrder)
router.post("/check-point", authenticate, checkPoint);
router.post("/sepay-callback", sepayCallback);
router.post("/shipping/fee", getShippingFee);
router.get('/users/:userId/orders', authenticate, getOrdersByUserId)
router.get('/users/:userId/rewards', authenticate, getRewardHistoryByUserId)
router.post('/users/cancel-request', authenticate, cancelOrderByUser);

export default router
