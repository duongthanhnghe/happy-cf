import { Router } from 'express';
import { getAllOrder, getOrderById, createOrder, deleteOrder, getAllStatus, getAllPayment, getOrdersByUserId, } from '../controllers/orderController.js';
const router = Router();
router.get('/', getAllOrder);
router.get('/status', getAllStatus);
router.get('/payments', getAllPayment);
router.get('/:id', getOrderById);
router.post('/', createOrder);
router.delete('/:id', deleteOrder);
router.get('/users/:userId/orders', getOrdersByUserId);
export default router;
//# sourceMappingURL=orderManage.js.map