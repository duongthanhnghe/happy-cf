import { Router } from 'express'
import {
  getBaseInformation,
  updateBaseInformation,
} from '../../../controllers/v1/shared/baseInformationController'
import { authenticate } from '../../../middlewares/authenticate'

const router = Router()

router.get('/', getBaseInformation)
router.put('/', authenticate, updateBaseInformation)

export default router
