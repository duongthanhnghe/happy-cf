import { Router } from 'express'

import adminRoutes from "./admin/index"
import sharedRoutes from "./shared/index"

// import settingRoutes from './admin/settingRouter'
// import fileManageRoutes from './shared/fileManageRouter'
import authRoutes from './authRouter'
// import aboutRoutes from './aboutRouter'
import bannerRoutes from './bannerRouter'
import categoriesNewsRoutes from './categoriesNewsRouter'
import postsNewsRoutes from './postsNewsRouter'
import orderManageRoutes from './orderManageRouter'
import categoriesProductRoutes from './categoriesProductRouter'
import productRoutes from './productRouter'
import addressRoutes from './addressesRouter'
// import paymentTransactionRoutes from './admin/paymentTransactionRoutes'
import wishlistRoutes from './productRouter'
import productReviewRouter from './productReviewRouter'
// import locationRoutes from './shared/locationRouter'

const router = Router()

router.use("/admin", adminRoutes)
router.use("/", sharedRoutes)

// router.use('/settings', settingRoutes)
// router.use('/fileManage', fileManageRoutes)
router.use('/auth', authRoutes)
// router.use('/about', aboutRoutes)
router.use('/banners', bannerRoutes)
router.use('/categoriesNews', categoriesNewsRoutes)
router.use('/newsPosts', postsNewsRoutes)
router.use('/orders', orderManageRoutes)
// router.use('/payment-transactions', paymentTransactionRoutes)
router.use('/categories', categoriesProductRoutes)
router.use('/products', productRoutes)
router.use('/addresses', addressRoutes)
router.use('/product-reviews', productReviewRouter)
// router.use('/location', locationRoutes)
router.use('/', wishlistRoutes)

export default router
