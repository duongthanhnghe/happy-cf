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
} from '../controllers/postNewsController'

const router = Router()

router.get('/category/:categoryId', getPostsByCategory)
router.get('/',          getAllPosts)
router.get('/latest', getPostsLatest)
router.get('/:id',       getPostsById)
router.post('/',         createPosts)
router.put('/:id',       updatePosts)
router.delete('/:id',    deletePosts)
router.patch('/toggleActive/:id', toggleActive)


export default router
