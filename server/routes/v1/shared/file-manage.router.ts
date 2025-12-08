import express from 'express'
import { uploadImageMulter } from '../../../middlewares/upload'
import {
  getImages,
  getFolders,
  deleteImage,
  searchImage,
  uploadImage
} from '../../../controllers/v1/shared/file-manage.controller'
import { authenticate } from '../../../middlewares/authenticate'
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'

const router = express.Router()

// router.get('/images', authenticate, getImages)
// router.get('/images/folders', authenticateAdmin, getFolders)
// router.delete('/images/delete', authenticate, deleteImage)
// router.get('/images/search', authenticate, searchImage)
// router.post('/images/upload', authenticate, uploadImageMulter.single('file'), uploadImage)

router.get('/images', authenticateAdmin, getImages)
router.get('/images/folders', authenticateAdmin, getFolders)
router.delete('/images/delete', authenticateAdmin, deleteImage)
router.get('/images/search', authenticateAdmin, searchImage)
router.post('/images/upload', authenticateAdmin, uploadImageMulter.single('file'), uploadImage)

export default router
