import { Router } from 'express';
import { getAllPosts, getPostsById, createPosts, updatePosts, deletePosts, getPostsLatest, } from '../controllers/postNewsController.js';
const router = Router();
router.get('/', getAllPosts);
router.get('/latest', getPostsLatest);
router.get('/:id', getPostsById);
router.post('/', createPosts);
router.put('/:id', updatePosts);
router.delete('/:id', deletePosts);
export default router;
//# sourceMappingURL=postsNews.js.map