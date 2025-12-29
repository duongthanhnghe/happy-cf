import { Router } from 'express'
import {
 getImageBlocksByPage,
} from '../../controllers/v1/image-block.controller'

const router = Router()
router.get("/by-page", getImageBlocksByPage)

export default router