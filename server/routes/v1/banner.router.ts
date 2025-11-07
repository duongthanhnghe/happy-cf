import { Router } from 'express'
import {
  getAllBanners,
} from '../../controllers/v1/banner.controller'

const router = Router()

router.get('/',          getAllBanners)

export default router
