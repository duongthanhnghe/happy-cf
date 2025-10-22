import { Router } from 'express';
import { getAllPosts, getPostsById, createPosts, updatePosts, deletePosts, 
// getPostsLatest,
toggleActive,
// getPostsByCategory,
// getPostBySlug,
// getRelatedPostsBySlug,
// updateView,
// getAllPostsPagination,
 } from '../../../controllers/v1/admin/postNewsController.js';
import { authenticateAdmin } from '../../../middlewares/authenticateAdmin.js';
const router = Router();
// router.get('/category/:categoryId', getPostsByCategory)
router.get('/', authenticateAdmin, getAllPosts);
// router.get('/pagination',          getAllPostsPagination)
// router.get('/slug/:slug',    getPostBySlug)
// router.get("/related/:slug", getRelatedPostsBySlug)
// router.patch("/view/:slug", updateView)
// router.get('/latest', getPostsLatest)
router.get('/:id', getPostsById);
router.post('/', authenticateAdmin, createPosts);
router.put('/:id', authenticateAdmin, updatePosts);
router.delete('/:id', authenticateAdmin, deletePosts);
router.patch('/toggleActive/:id', authenticateAdmin, toggleActive);
export default router;
//# sourceMappingURL=postsNewsRouter.js.map