import { Router } from 'express';
import { getAllCategories, getCategoriesById, createCategories, updateCategories, deleteCategories, getProductsByCategory, toggleActive, updateOrder, } from '../controllers/categoriesProductController.js';
const router = Router();
router.get('/', getAllCategories);
router.get('/:id', getCategoriesById);
router.post('/', createCategories);
router.put('/:id', updateCategories);
router.delete('/:id', deleteCategories);
router.get('/:id/products', getProductsByCategory);
router.patch('/toggleActive/:id', toggleActive);
router.patch('/updateOrder/:id', updateOrder);
export default router;
//# sourceMappingURL=categoriesProductRouter.js.map