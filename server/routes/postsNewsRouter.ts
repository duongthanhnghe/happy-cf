import { Router } from 'express'
import {
  getAllPosts,
  getPostsById,
  createPosts,
  updatePosts,
  deletePosts,
  getPostsLatest,
  toggleActive,
  getPostsByCategory,
  getPostBySlug,
  getRelatedPostsBySlug,
  updateView,
  getAllPostsPagination,
} from '../controllers/postNewsController'

const router = Router()

router.get('/category/:categoryId', getPostsByCategory)
router.get('/',          getAllPosts)
router.get('/pagination',          getAllPostsPagination)
router.get('/slug/:slug',    getPostBySlug)
router.get("/related/:slug", getRelatedPostsBySlug)
router.patch("/view/:slug", updateView)
router.get('/latest', getPostsLatest)
router.get('/:id',       getPostsById)
router.post('/',         createPosts)
router.put('/:id',       updatePosts)
router.delete('/:id',    deletePosts)
router.patch('/toggleActive/:id', toggleActive)


export default router
