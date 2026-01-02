import { Router } from 'express'
import {
  getBaseInformation,
  updateBaseInformation,
} from '../../../controllers/v1/shared/base-Information.controller'
import { authenticate } from '../../../middlewares/authenticate'
import { validate } from '../../../middlewares/validate/validate'
import { updateBaseInformationSchema } from '../../../../shared/validate/schemas/base-information.schema'

const router = Router()

router.get('/', getBaseInformation)
router.put('/', authenticate, validate(updateBaseInformationSchema), updateBaseInformation)

export default router
