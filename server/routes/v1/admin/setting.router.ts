import { Router } from 'express'
import {
  updateSettings,
} from '../../../controllers/v1/admin/setting.controller'
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'

const router = Router()

router.put('/update', authenticateAdmin, updateSettings)

export default router
