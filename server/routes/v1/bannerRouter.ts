import { Router } from 'express'
import {
  getAllBanners,
} from '../../controllers/v1/bannerController'

const router = Router()

router.get('/',          getAllBanners)

export default router
