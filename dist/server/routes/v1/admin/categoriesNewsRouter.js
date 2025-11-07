import { Router } from 'express';
import { getAllCategories, getCategoriesById, createCategories, updateCategories, deleteCategories, toggleActive, updateOrder, } from '../../../controllers/v1/admin/categories-news.controller.js';
import { authenticateAdmin } from '../../../middlewares/authenticateAdmin.js';
const router = Router();
router.get('/', authenticateAdmin, getAllCategories);
router.get('/:id', getCategoriesById);
router.post('/', authenticateAdmin, createCategories);
router.put('/:id', authenticateAdmin, updateCategories);
router.delete('/:id', authenticateAdmin, deleteCategories);
router.patch('/toggleActive/:id', authenticateAdmin, toggleActive);
router.patch('/updateOrder/:id', authenticateAdmin, updateOrder);
export default router;
//# sourceMappingURL=categoriesNewsRouter.js.map