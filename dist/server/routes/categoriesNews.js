import { Router } from 'express';
import { getAllCategories, getCategoriesById, createCategories, updateCategories, deleteCategories, } from '../controllers/categoriesNewsController.js';
const router = Router();
router.get('/', getAllCategories);
router.get('/:id', getCategoriesById);
router.post('/', createCategories);
router.put('/:id', updateCategories);
router.delete('/:id', deleteCategories);
export default router;
//# sourceMappingURL=categoriesNews.js.map