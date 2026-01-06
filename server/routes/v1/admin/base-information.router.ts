import { Router } from 'express'
import {
  getBaseInformation,
  updateBaseInformation,
} from '../../../controllers/v1/admin/base-Information.controller'
import { validate } from '../../../middlewares/validate/validate'
import { updateBaseInformationSchema } from '../../../../shared/validate/schemas/base-information.schema'
import { authenticateAdmin } from '../../../middlewares/authenticate-admin'

const router = Router()

router.get('/', getBaseInformation)
router.put('/', authenticateAdmin, validate(updateBaseInformationSchema), updateBaseInformation)

export default router
