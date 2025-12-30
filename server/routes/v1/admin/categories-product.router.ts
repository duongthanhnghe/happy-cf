import { Router } from 'express'
import {
  getAllCategories,
  getCategoriesById,
  createCategories,
  updateCategories,
  deleteCategories,
  toggleActive,
  updateOrder,
  getAllCategoriesTree,
} from '../../../controllers/v1/admin/categories-product.controller'
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'
import { validate } from '../../../middlewares/validate/validate'
import { createCategoryProductSchema, updateCategoryProductSchema, categoryIdParamSchema } from '../../../../shared/validate/schemas/category-product.schema'

const router = Router()

router.get('/tree',         authenticateAdmin, getAllCategoriesTree)
router.get('/',         authenticateAdmin, getAllCategories)
router.get('/:id',       authenticateAdmin, validate(categoryIdParamSchema, 'params'), getCategoriesById)
router.post('/',        authenticateAdmin, validate(createCategoryProductSchema),createCategories)
router.put('/:id',      authenticateAdmin, validate(updateCategoryProductSchema),updateCategories)
router.delete('/:id',   authenticateAdmin, validate(categoryIdParamSchema, 'params'), deleteCategories)
router.patch('/toggleActive/:id',authenticateAdmin, validate(categoryIdParamSchema, 'params'), toggleActive)
router.patch('/updateOrder/:id',  authenticateAdmin, validate(categoryIdParamSchema, 'params'), updateOrder)

export default router
