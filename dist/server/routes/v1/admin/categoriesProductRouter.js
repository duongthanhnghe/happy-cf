import { Router } from 'express';
import { getAllCategories, getCategoriesById, createCategories, updateCategories, deleteCategories, 
// getProductsByCategory,
toggleActive, updateOrder, 
// getCategoriesBySlug,
getAllCategoriesTree,
// getChildrenCategories,
 } from '../../../controllers/v1/admin/categories-product.controller.js';
import { authenticateAdmin } from '../../../middlewares/authenticateAdmin.js';
const router = Router();
router.get('/tree', authenticateAdmin, getAllCategoriesTree);
router.get('/', authenticateAdmin, getAllCategories);
// router.get('/slug/:slug',    getCategoriesBySlug)
router.get('/:id', getCategoriesById);
// router.get("/:id/children", getChildrenCategories);
router.post('/', authenticateAdmin, createCategories);
router.put('/:id', authenticateAdmin, updateCategories);
router.delete('/:id', authenticateAdmin, deleteCategories);
// router.get('/:id/products', getProductsByCategory)
router.patch('/toggleActive/:id', authenticateAdmin, toggleActive);
router.patch('/updateOrder/:id', authenticateAdmin, updateOrder);
export default router;
//# sourceMappingURL=categoriesProductRouter.js.map