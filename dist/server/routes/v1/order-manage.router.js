import { Router } from 'express';
import { getOrderById, createOrder, getOrdersByUserId, getRewardHistoryByUserId, checkPoint, sepayCallback, getShippingFee, cancelOrderByUser, getPendingRewardPoints, } from '../../controllers/v1/order.controller.js';
import { authenticate } from '../../middlewares/authenticate.js';
const router = Router();
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.post("/check-point", authenticate, checkPoint);
router.post("/sepay-callback", sepayCallback);
router.post("/shipping/fee", getShippingFee);
router.get('/users/:userId/orders', authenticate, getOrdersByUserId);
router.get('/users/:userId/rewards', authenticate, getRewardHistoryByUserId);
router.post('/users/cancel-request', authenticate, cancelOrderByUser);
router.get('/rewards/pending/:userId', authenticate, getPendingRewardPoints);
export default router;
//# sourceMappingURL=order-manage.router.js.map