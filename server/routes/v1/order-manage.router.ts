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
  getPendingRewardPoints,
} from '../../controllers/v1/order.controller'
import { authenticate } from '../../middlewares/authenticate'
import { validate } from '../../middlewares/validate/validate'
import { createOrderSchema, orderIdParamSchema } from '../../../shared/validate/schemas/order.schema'

const router = Router()

router.get('/:id',       validate(orderIdParamSchema, 'params'), getOrderById)
router.post('/',         validate(createOrderSchema), createOrder)
router.post("/check-point", authenticate, checkPoint);
router.post("/sepay-callback", sepayCallback);
router.post("/shipping/fee", getShippingFee);
router.get('/users/:userId/orders', authenticate, getOrdersByUserId)
router.get('/users/:userId/rewards', authenticate, getRewardHistoryByUserId)
router.post('/users/cancel-request', authenticate, cancelOrderByUser);
router.get('/rewards/pending/:userId', authenticate, getPendingRewardPoints)

export default router
