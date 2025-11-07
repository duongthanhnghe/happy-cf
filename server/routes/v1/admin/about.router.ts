import { Router } from 'express'
import {
  getAllAbout,
  getAboutById,
  createAbout,
  updateAbout,
  deleteAbout,
  updateOrder,
  toggleActive,
} from '../../../controllers/v1/admin/about.controller'
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'

const router = Router()

router.get('/',          authenticateAdmin, getAllAbout)
router.get('/:id',       getAboutById)
router.post('/',         authenticateAdmin, createAbout)
router.put('/:id',       authenticateAdmin, updateAbout)
router.delete('/:id',    authenticateAdmin, deleteAbout)
router.patch('/updateOrder/:id', authenticateAdmin, updateOrder)
router.patch('/toggleActive/:id', authenticateAdmin, toggleActive)

export default router
