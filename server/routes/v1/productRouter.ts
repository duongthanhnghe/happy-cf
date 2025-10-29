import { Router } from 'express'
import {
  // getAllProduct,
  getProductById,
  // createProduct,
  // updateProduct,
  // deleteProduct,
  getPromotionalProducts,
  getMostOrderedProduct,
  getWishlistByUserId,
  addWishlistItem,
  deleteWishlistItem,
  // toggleActive,
  searchProducts,
  getRelatedProducts,
  getCartProducts,
} from '../../controllers/v1/productController'
import { authenticate } from '../../middlewares/authenticate'

const router = Router()

router.post('/cart-detail', getCartProducts)
router.get('/promotion', getPromotionalProducts)
router.get('/most-order', getMostOrderedProduct)
router.get('/search', searchProducts)
router.get('/related/:slug', getRelatedProducts)
router.get('/:id',       getProductById)
router.get('/users/:userId/wishlist', authenticate, getWishlistByUserId)
router.post('/users/:userId/wishlist', authenticate, addWishlistItem)
router.delete('/users/:userId/wishlist/:productId', authenticate, deleteWishlistItem)

export default router
