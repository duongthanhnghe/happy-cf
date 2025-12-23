import { Router } from 'express'
import {
  getAllOrder,
  getOrderById,
  deleteOrder,
  getAllStatus,
  getAllPayment,
  updateOrderStatus,
} from '../../../controllers/v1/admin/order.controller'
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'

const router = Router()

router.get('/',         authenticateAdmin, getAllOrder)
router.get('/status',          getAllStatus)
router.get('/payments',          getAllPayment)
router.get('/:id',       authenticateAdmin, getOrderById)
router.delete('/:id',   authenticateAdmin, deleteOrder)
router.put('/status',              authenticateAdmin, updateOrderStatus)


export default router
