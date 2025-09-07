import { Router } from 'express';
import { getAllCategories, getCategoriesById, createCategories, updateCategories, deleteCategories, getProductsByCategory, } from '../controllers/categoriesProductController.js';
const router = Router();
router.get('/', getAllCategories);
router.get('/:id', getCategoriesById);
router.post('/', createCategories);
router.put('/:id', updateCategories);
router.delete('/:id', deleteCategories);
router.get('/:id/products', getProductsByCategory);
export default router;
//# sourceMappingURL=categoriesProduct.js.map