import { Router } from 'express'
import {
  updateSettings,
} from '../controllers/settingController'

const router = Router()

router.put('/update', updateSettings)

export default router
