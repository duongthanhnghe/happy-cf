import { Router } from 'express';
import { getAllOrder, getOrderById, 
// createOrder,
deleteOrder, getAllStatus, getAllPayment, 
// getOrdersByUserId,
updateOrderStatus,
// getRewardHistoryByUserId,
// checkPoint,
// sepayCallback,
// getShippingFee,
 } from '../../../controllers/v1/admin/orderController.js';
const router = Router();
router.get('/', getAllOrder);
router.get('/status', getAllStatus);
router.get('/payments', getAllPayment);
router.get('/:id', getOrderById);
// router.post('/',         createOrder)
// router.post("/check-point", checkPoint);
// router.post("/sepay-callback", sepayCallback);
// router.post("/shipping/fee", getShippingFee);
router.delete('/:id', deleteOrder);
// router.get('/users/:userId/orders', getOrdersByUserId)
// router.get('/users/:userId/rewards', getRewardHistoryByUserId)
router.put('/status', updateOrderStatus);
export default router;
//# sourceMappingURL=orderManageRouter.js.map