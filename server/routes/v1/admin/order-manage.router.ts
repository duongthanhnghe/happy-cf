import { Router } from 'express'
import {
  getAllOrder,
  getOrderById,
  deleteOrder,
  getAllStatus,
  getAllPayment,
  updateOrderStatus,
  getAllShippingProviders,
  getShippingProviderDetail,
  createOrderShipping,
  updateOrderShippingStatus,
  getOrderShippingDetail,
  getOrderCountByStatus,
  exportOrders,
  printOrderBill,
} from '../../../controllers/v1/admin/order.controller'
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'
import { validate } from '../../../middlewares/validate/validate'
import { orderIdParamSchema, updateOrderStatusSchema } from '../../../../shared/validate/schemas/order.schema'

const router = Router()

router.get('/', authenticateAdmin, getAllOrder)
router.get("/count-by-status", authenticateAdmin, getOrderCountByStatus)
router.get("/export", authenticateAdmin, exportOrders)
router.get('/status', getAllStatus)
router.get('/payments', getAllPayment)
router.put('/status', authenticateAdmin, validate(updateOrderStatusSchema), updateOrderStatus)

// shipping
router.get('/shipping-providers', authenticateAdmin, getAllShippingProviders)
router.get('/shipping-providers/:id', authenticateAdmin, getShippingProviderDetail)

// order shipping
router.post('/order-shipping', authenticateAdmin, createOrderShipping)
router.get('/order-shipping/:id', authenticateAdmin, getOrderShippingDetail)
router.put('/order-shipping/:id/status', authenticateAdmin, updateOrderShippingStatus)

// order detail
router.get('/:id', authenticateAdmin, validate(orderIdParamSchema, 'params'), getOrderById)
router.delete('/:id', authenticateAdmin, validate(orderIdParamSchema, 'params'), deleteOrder)
router.get("/:id/print", validate(orderIdParamSchema, 'params'), printOrderBill)


export default router
