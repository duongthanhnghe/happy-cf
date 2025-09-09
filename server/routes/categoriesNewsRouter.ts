import { Router } from 'express'
import {
  getAllCategories,
  getCategoriesById,
  createCategories,
  updateCategories,
  deleteCategories,
  toggleActive,
  updateOrder,
  getCategoryBySlug,
} from '../controllers/categoriesNewsController.js'

const router = Router()

router.get('/',          getAllCategories)
router.get('/slug/:slug',    getCategoryBySlug)
router.get('/:id',       getCategoriesById)
router.post('/',         createCategories)
router.put('/:id',       updateCategories)
router.delete('/:id',    deleteCategories)
router.patch('/toggleActive/:id', toggleActive)
router.patch('/updateOrder/:id',  updateOrder)

export default router
