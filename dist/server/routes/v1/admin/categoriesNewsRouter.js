import { Router } from 'express';
import { getAllCategories, getCategoriesById, createCategories, updateCategories, deleteCategories, toggleActive, updateOrder, } from '../../../controllers/v1/admin/categoriesNewsController.js';
const router = Router();
router.get('/', getAllCategories);
router.get('/:id', getCategoriesById);
router.post('/', createCategories);
router.put('/:id', updateCategories);
router.delete('/:id', deleteCategories);
router.patch('/toggleActive/:id', toggleActive);
router.patch('/updateOrder/:id', updateOrder);
export default router;
//# sourceMappingURL=categoriesNewsRouter.js.map