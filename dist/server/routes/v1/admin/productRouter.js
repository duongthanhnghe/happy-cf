import { Router } from 'express';
import { getAllProduct, getProductById, createProduct, updateProduct, deleteProduct, 
// getPromotionalProducts,
// getMostOrderedProduct,
// getWishlistByUserId,
// addWishlistItem,
// deleteWishlistItem,
toggleActive,
// searchProducts,
// getRelatedProducts,
 } from '../../../controllers/v1/admin/productController.js';
import { authenticateAdmin } from '../../../middlewares/authenticateAdmin.js';
const router = Router();
router.get('/', authenticateAdmin, getAllProduct);
// router.get('/promotion', getPromotionalProducts)
// router.get('/most-order', getMostOrderedProduct)
// router.get('/search', searchProducts)
// router.get('/related/:slug', getRelatedProducts)
router.post('/', authenticateAdmin, createProduct);
router.get('/:id', getProductById);
router.put('/:id', authenticateAdmin, updateProduct);
router.delete('/:id', authenticateAdmin, deleteProduct);
router.patch('/toggleActive/:id', authenticateAdmin, toggleActive);
// router.get('/users/:userId/wishlist', getWishlistByUserId)
// router.post('/users/:userId/wishlist', addWishlistItem)
// router.delete('/users/:userId/wishlist/:productId', deleteWishlistItem)
export default router;
//# sourceMappingURL=productRouter.js.map