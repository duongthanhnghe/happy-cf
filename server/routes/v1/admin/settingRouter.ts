import { Router } from 'express'
import {
  updateSettings,
} from '../../../controllers/v1/admin/settingController'

const router = Router()

router.put('/update', updateSettings)

export default router
