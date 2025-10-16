import { Router } from 'express'

import fileManageRoutes from './fileManageRouter'
import locationRoutes from './locationRouter'

const router = Router()

router.use('/fileManage', fileManageRoutes)
router.use('/location', locationRoutes)

export default router
