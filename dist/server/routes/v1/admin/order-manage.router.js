import { Router } from 'express';
import { getAllOrder, getOrderById, deleteOrder, getAllStatus, getAllPayment, updateOrderStatus, getAllShippingProviders, getShippingProviderDetail, createOrderShipping, updateOrderShippingStatus, getOrderShippingDetail, getOrderCountByStatus, exportOrders, printOrderBill, } from '../../../controllers/v1/admin/order.controller.js';
import { authenticateAdmin } from '../../../middlewares/authenticate-admin.js';
const router = Router();
router.get('/', authenticateAdmin, getAllOrder);
router.get("/count-by-status", authenticateAdmin, getOrderCountByStatus);
router.get("/export", authenticateAdmin, exportOrders);
router.get('/status', getAllStatus);
router.get('/payments', getAllPayment);
router.put('/status', authenticateAdmin, updateOrderStatus);
/* ========== SHIPPING PROVIDERS ========== */
router.get('/shipping-providers', authenticateAdmin, getAllShippingProviders);
router.get('/shipping-providers/:id', authenticateAdmin, getShippingProviderDetail);
/* ========== ORDER SHIPPING ========== */
router.post('/order-shipping', authenticateAdmin, createOrderShipping);
router.get('/order-shipping/:id', authenticateAdmin, getOrderShippingDetail);
router.put('/order-shipping/:id/status', authenticateAdmin, updateOrderShippingStatus);
/* ========== ORDER DETAIL ========== */
router.get('/:id', authenticateAdmin, getOrderById);
router.delete('/:id', authenticateAdmin, deleteOrder);
router.get("/:id/print", printOrderBill);
export default router;
//# sourceMappingURL=order-manage.router.js.map