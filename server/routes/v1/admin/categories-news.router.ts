import { Router } from 'express'
import {
  getAllCategories,
  getCategoriesById,
  createCategories,
  updateCategories,
  deleteCategories,
  toggleActive,
  updateOrder,
} from '../../../controllers/v1/admin/categories-news.controller'
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'
import { validate } from '../../../middlewares/validate/validate'
import { createCategoryNewsSchema, updateCategoryNewsSchema, categoryNewsIdParamSchema } from '../../../../shared/validate/schemas/category-news.schema'

const router = Router()

router.get('/',          authenticateAdmin, getAllCategories)
router.get('/:id',       authenticateAdmin, getCategoriesById)
router.post('/',         authenticateAdmin, validate(createCategoryNewsSchema), createCategories)
router.put('/:id',       authenticateAdmin, validate(updateCategoryNewsSchema), updateCategories)
router.delete('/:id',    authenticateAdmin, validate(categoryNewsIdParamSchema, 'params'), deleteCategories)
router.patch('/toggleActive/:id', authenticateAdmin, validate(categoryNewsIdParamSchema, 'params'), toggleActive)
router.patch('/updateOrder/:id',  authenticateAdmin, validate(categoryNewsIdParamSchema, 'params'), updateOrder)

export default router
