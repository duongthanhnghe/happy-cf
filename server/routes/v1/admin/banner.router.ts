import { Router } from 'express'
import {
  getAllBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner,
  updateOrder,
  toggleActive,
} from '../../../controllers/v1/admin/banner.controller'
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'
import { validate } from '../../../middlewares/validate/validate'
import { createBannerSchema, updateBannerSchema, bannerIdParamSchema } from '../../../../shared/validate/schemas/banner.schema'

const router = Router()

router.get('/',          authenticateAdmin, getAllBanners)
router.get('/:id',       authenticateAdmin, getBannerById)
router.post('/',         authenticateAdmin, validate(createBannerSchema), createBanner)
router.put('/:id',       authenticateAdmin, validate(updateBannerSchema), updateBanner)
router.delete('/:id',    authenticateAdmin, validate(bannerIdParamSchema, 'params'), deleteBanner)
router.patch('/updateOrder/:id', authenticateAdmin, validate(bannerIdParamSchema, 'params'), updateOrder)
router.patch('/toggleActive/:id', authenticateAdmin, validate(bannerIdParamSchema, 'params'), toggleActive)

export default router
