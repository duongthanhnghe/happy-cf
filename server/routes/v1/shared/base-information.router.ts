import { Router } from 'express'
import {
  getBaseInformation,
  updateBaseInformation,
} from '../../../controllers/v1/shared/base-Information.controller'
import { authenticate } from '../../../middlewares/authenticate'

const router = Router()

router.get('/', getBaseInformation)
router.put('/', authenticate, updateBaseInformation)

export default router
