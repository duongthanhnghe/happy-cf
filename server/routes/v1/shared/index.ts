import { Router } from 'express'

import fileManageRoutes from './fileManageRouter'
import locationRoutes from './locationRouter'
import baseInformationRoutes from './baseInformationRouter'

const router = Router()

router.use('/fileManage', fileManageRoutes)
router.use('/location', locationRoutes)
router.use('/base-information', baseInformationRoutes)

export default router
