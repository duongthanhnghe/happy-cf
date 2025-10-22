import { Router } from 'express'
import {
  updateSettings,
} from '../../../controllers/v1/admin/settingController'
import { authenticateAdmin } from '../../../middlewares/authenticateAdmin'

const router = Router()

router.put('/update', authenticateAdmin, updateSettings)

export default router
