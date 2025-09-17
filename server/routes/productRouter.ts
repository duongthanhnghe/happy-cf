import { Router } from 'express'
import {
  getAllProduct,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getPromotionalProducts,
  getMostOrderedProduct,
  getWishlistByUserId,
  addWishlistItem,
  deleteWishlistItem,
  toggleActive,
  searchProducts,
} from '../controllers/productController.js'

const router = Router()

router.get('/', getAllProduct)
router.get('/promotion', getPromotionalProducts)
router.get('/most-order', getMostOrderedProduct)
router.get('/search', searchProducts)
router.post('/',         createProduct)
router.get('/:id',       getProductById)
router.put('/:id',       updateProduct)
router.delete('/:id',    deleteProduct)
router.patch('/toggleActive/:id', toggleActive)
router.get('/users/:userId/wishlist', getWishlistByUserId)
router.post('/users/:userId/wishlist', addWishlistItem)
router.delete('/users/:userId/wishlist/:productId', deleteWishlistItem)

export default router
