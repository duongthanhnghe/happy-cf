import express from 'express'
import { uploadImageMulter } from '../../../middlewares/upload'
import {
  getImages,
  getFolders,
  deleteImage,
  searchImage,
  uploadImage,
  deleteImages
} from '../../../controllers/v1/admin/file-manage.controller'
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'

const router = express.Router()

router.get('/images', getImages)
router.get('/images/folders', authenticateAdmin, getFolders)
router.delete('/images/delete', deleteImage)
router.post('/images', authenticateAdmin, deleteImages)
router.get('/images/search', searchImage)
router.post('/images/upload', uploadImageMulter.array('files', 50), uploadImage)

export default router
