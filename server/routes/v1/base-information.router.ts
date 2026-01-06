import { Router } from 'express'
import {
  getBaseInformation,
} from '../../controllers/v1/base-information.controller'

const router = Router()

router.get('/', getBaseInformation)

export default router
