import express from 'express'
import { uploadImageMulter } from '../../../middlewares/upload'
import {
  getImages,
  getFolders,
  deleteImage,
  searchImage,
  uploadImage,
  deleteImages
} from '../../../controllers/v1/shared/file-manage.controller'
import { authenticate } from '../../../middlewares/authenticate'
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'

const router = express.Router()

router.get('/images', getImages)
router.get('/images/folders', authenticateAdmin, getFolders)
router.delete('/images/delete', deleteImage)
router.delete('/images', authenticateAdmin, deleteImages)
router.get('/images/search', searchImage)
router.post('/images/upload', uploadImageMulter.array('files', 50), uploadImage)

export default router
