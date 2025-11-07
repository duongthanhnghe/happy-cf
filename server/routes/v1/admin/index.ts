import { Router } from 'express'

import settingRoutes from './setting.router'
// import fileManageRoutes from './fileManageRouter'
// import authRoutes from './authRouter'
import aboutRoutes from './about.router'
import usersRouter from './users.router'
import bannerRoutes from './banner.router'
import categoriesNewsRoutes from './categories-news.router'
import postsNewsRoutes from './posts-news.router'
import orderManageRoutes from './order-manage.router'
import categoriesProductRoutes from './categories-product.router'
import productRoutes from './product.router'
// import addressRoutes from './addressesRouter'
import paymentTransactionRoutes from './payment-transaction.routes'
// import wishlistRoutes from './productRouter'
import productReviewRouter from './product-review.router'
import voucherRouter from './voucher.router'
import voucherUsageRouter from './voucher-usage.router'
import accountRouter from './account.router'
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
