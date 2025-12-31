import { Router } from 'express'
import {
  getAllPosts,
  getPostsById,
  createPosts,
  updatePosts,
  deletePosts,
  toggleActive,
} from '../../../controllers/v1/admin/post-news.controller'
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'
import { validate } from '../../../middlewares/validate/validate'
import { createPostNewsSchema, updatePostNewsSchema, postNewsIdParamSchema } from '../../../../shared/validate/schemas/news.schema'

const router = Router()

router.get('/', authenticateAdmin, getAllPosts)
router.get('/:id',       authenticateAdmin, getPostsById)
router.post('/',         authenticateAdmin, validate(createPostNewsSchema), createPosts)
router.put('/:id',       authenticateAdmin, validate(updatePostNewsSchema), updatePosts)
router.delete('/:id',    authenticateAdmin, validate(postNewsIdParamSchema, 'params'), deletePosts)
router.patch('/toggleActive/:id', authenticateAdmin, validate(postNewsIdParamSchema, 'params'), toggleActive)

export default router
