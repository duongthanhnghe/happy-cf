import express from 'express'
import { uploadImageMulter } from '../../middlewares/upload'
import {
  getImages,
  getFolders,
  deleteImage,
  searchImage,
  uploadImage
} from '../../controllers/v1/fileManageController'

const router = express.Router()

router.get('/images', getImages)
router.get('/images/folders', getFolders)
router.delete('/images/delete', deleteImage)
router.get('/images/search', searchImage)
router.post('/images/upload', uploadImageMulter.single('file'), uploadImage)

export default router
