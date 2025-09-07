import { Router } from 'express';
import { getAllProduct, getProductById, createProduct, updateProduct, deleteProduct, getMostOrderedProduct, getWishlistByUserId, addWishlistItem, deleteWishlistItem, } from '../controllers/productController.js';
const router = Router();
router.get('/', getAllProduct);
router.get('/most-order', getMostOrderedProduct);
router.post('/', createProduct);
router.get('/:id', getProductById);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);
router.get('/users/:userId/wishlist', getWishlistByUserId);
router.post('/users/:userId/wishlist', addWishlistItem);
router.delete('/users/:userId/wishlist/:productId', deleteWishlistItem);
export default router;
//# sourceMappingURL=product.js.map