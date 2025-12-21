import { Router } from 'express';
import { getProductById, getPromotionalProducts, getMostOrderedProduct, getWishlistByUserId, addWishlistItem, deleteWishlistItem, searchProducts, getRelatedProducts, getCartProducts, getProductsByCategory, checkProductStock, } from '../../controllers/v1/product.controller.js';
import { authenticate } from '../../middlewares/authenticate.js';
const router = Router();
router.post('/cart-detail', getCartProducts);
router.post('/check-stock', checkProductStock);
router.get('/promotion', getPromotionalProducts);
router.get('/most-order', getMostOrderedProduct);
router.get('/search', searchProducts);
router.get('/related/:slug', getRelatedProducts);
router.get('/category/:id', getProductsByCategory);
router.get('/:id', getProductById);
router.get('/users/:userId/wishlist', authenticate, getWishlistByUserId);
router.post('/users/:userId/wishlist', authenticate, addWishlistItem);
router.delete('/users/:userId/wishlist/:productId', authenticate, deleteWishlistItem);
export default router;
//# sourceMappingURL=product.router.js.map