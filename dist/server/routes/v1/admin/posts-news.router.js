import { Router } from 'express';
import { getAllPosts, getPostsById, createPosts, updatePosts, deletePosts, toggleActive, } from '../../../controllers/v1/admin/post-news.controller.js';
import { authenticateAdmin } from '../../../middlewares/authenticate-admin.js';
const router = Router();
router.get('/', authenticateAdmin, getAllPosts);
router.get('/:id', authenticateAdmin, getPostsById);
router.post('/', authenticateAdmin, createPosts);
router.put('/:id', authenticateAdmin, updatePosts);
router.delete('/:id', authenticateAdmin, deletePosts);
router.patch('/toggleActive/:id', authenticateAdmin, toggleActive);
export default router;
//# sourceMappingURL=posts-news.router.js.map