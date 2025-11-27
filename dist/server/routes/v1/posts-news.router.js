import { Router } from 'express';
import { getPostsById, getPostsLatest, getPostsByCategory, getPostBySlug, getRelatedPostsBySlug, updateView, getAllPostsPagination, } from '../../controllers/v1/post-news.controller.js';
const router = Router();
router.get('/category/:categoryId', getPostsByCategory);
router.get('/pagination', getAllPostsPagination);
router.get('/slug/:slug', getPostBySlug);
router.get("/related/:slug", getRelatedPostsBySlug);
router.patch("/view/:slug", updateView);
router.get('/latest', getPostsLatest);
router.get('/:id', getPostsById);
export default router;
//# sourceMappingURL=posts-news.router.js.map