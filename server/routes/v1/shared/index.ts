import { Router } from 'express'

import fileManageRoutes from '../file-manage.router'
import locationRoutes from './location.router'
import baseInformationRoutes from './base-information.router'

const router = Router()

router.use('/fileManage', fileManageRoutes)
router.use('/location', locationRoutes)
router.use('/base-information', baseInformationRoutes)

export default router
