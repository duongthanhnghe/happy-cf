import { Router } from 'express';
import { getAllCategories, getCategoriesById, getCategoryBySlug, } from '../../controllers/v1/categoriesNewsController.js';
const router = Router();
router.get('/', getAllCategories);
router.get('/slug/:slug', getCategoryBySlug);
router.get('/:id', getCategoriesById);
export default router;
//# sourceMappingURL=categoriesNewsRouter.js.map