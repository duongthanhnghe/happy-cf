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
import { validate } from '../../../middlewares/validate/validate'
import { createAboutSchema, updateAboutSchema, aboutIdParamSchema } from '../../../../shared/validate/schemas/about.schema'

const router = Router()

router.get('/',          authenticateAdmin, getAllAbout)
router.get('/:id',       authenticateAdmin, getAboutById)
router.post('/',         authenticateAdmin, validate(createAboutSchema), createAbout)
router.put('/:id',       authenticateAdmin, validate(updateAboutSchema), updateAbout)
router.delete('/:id',    authenticateAdmin, validate(aboutIdParamSchema, 'params'), deleteAbout)
router.patch('/updateOrder/:id', authenticateAdmin, validate(aboutIdParamSchema, 'params'), updateOrder)
router.patch('/toggleActive/:id', authenticateAdmin, validate(aboutIdParamSchema, 'params'), toggleActive)

export default router
