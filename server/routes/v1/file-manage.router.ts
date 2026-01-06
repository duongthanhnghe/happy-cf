import express from 'express'
import { uploadImageMulter } from '../../middlewares/upload'
import {
  getImages,
  deleteImage,
  searchImage,
  uploadImage,
} from '../../controllers/v1/file-manage.controller'
import { authenticate } from '../../middlewares/authenticate'

const router = express.Router()

router.get('/images', authenticate, getImages)
router.delete('/images/delete', authenticate, deleteImage)
router.get('/images/search', authenticate, searchImage)
router.post('/images/upload', authenticate, uploadImageMulter.array('files', 50), uploadImage)

export default router
