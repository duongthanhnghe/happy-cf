import { Router } from 'express';
import { getAllCategories, getCategoriesById, createCategories, updateCategories, deleteCategories, getProductsByCategory, toggleActive, updateOrder, getCategoriesBySlug, getAllCategoriesTree, getChildrenCategories, } from '../controllers/categoriesProductController.js';
const router = Router();
router.get('/tree', getAllCategoriesTree);
router.get('/', getAllCategories);
router.get('/slug/:slug', getCategoriesBySlug);
router.get('/:id', getCategoriesById);
router.get("/:id/children", getChildrenCategories);
router.post('/', createCategories);
router.put('/:id', updateCategories);
router.delete('/:id', deleteCategories);
router.get('/:id/products', getProductsByCategory);
router.patch('/toggleActive/:id', toggleActive);
router.patch('/updateOrder/:id', updateOrder);
export default router;
//# sourceMappingURL=categoriesProductRouter.js.map