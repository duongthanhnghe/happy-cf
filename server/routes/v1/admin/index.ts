import { Router } from 'express'

import settingRoutes from './settingRouter'
// import fileManageRoutes from './fileManageRouter'
// import authRoutes from './authRouter'
import aboutRoutes from './aboutRouter'
import usersRouter from './usersRouter'
import bannerRoutes from './bannerRouter'
import categoriesNewsRoutes from './categoriesNewsRouter'
import postsNewsRoutes from './postsNewsRouter'
import orderManageRoutes from './orderManageRouter'
import categoriesProductRoutes from './categoriesProductRouter'
import productRoutes from './productRouter'
// import addressRoutes from './addressesRouter'
import paymentTransactionRoutes from './paymentTransactionRoutes'
// import wishlistRoutes from './productRouter'
import productReviewRouter from './productReviewRouter'
import voucherRouter from './voucherRouter'
import voucherUsageRouter from './voucherUsageRouter'
import accountRouter from './accountRouter'
// import locationRoutes from './locationRouter'

const router = Router()

router.use('/account', accountRouter)
router.use('/settings', settingRoutes)
// router.use('/fileManage', fileManageRoutes)
// router.use('/auth', authRoutes)
router.use('/about', aboutRoutes)
router.use('/users', usersRouter)
router.use('/banners', bannerRoutes)
router.use('/categoriesNews', categoriesNewsRoutes)
router.use('/newsPosts', postsNewsRoutes)
router.use('/orders', orderManageRoutes)
router.use('/payment-transactions', paymentTransactionRoutes)
router.use('/categories', categoriesProductRoutes)
router.use('/products', productRoutes)
// router.use('/addresses', addressRoutes)
router.use('/product-reviews', productReviewRouter)
router.use('/voucher', voucherRouter)
router.use('/voucher-usage', voucherUsageRouter)
// router.use('/location', locationRoutes)
// router.use('/', wishlistRoutes)

export default router
