import { Router } from 'express'

import locationRoutes from './location.router'

const router = Router()

router.use('/location', locationRoutes)

export default router
