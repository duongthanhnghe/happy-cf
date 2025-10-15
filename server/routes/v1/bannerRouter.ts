import { Router } from 'express'
import {
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  updateOrder,
  toggleActive,
} from '../../controllers/v1/bannerController'

const router = Router()

router.get('/',          getAllBanners)
router.get('/:id',       getBannerById)
router.post('/',         createBanner)
router.put('/:id',       updateBanner)
router.delete('/:id',    deleteBanner)
router.patch('/updateOrder/:id', updateOrder)
router.patch('/toggleActive/:id', toggleActive)

export default router
