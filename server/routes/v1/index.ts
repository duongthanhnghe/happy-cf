import { Router } from 'express'

import adminRoutes from "./admin/index"
import sharedRoutes from "./shared/index"

// import settingRoutes from './admin/settingRouter'
// import fileManageRoutes from './shared/fileManageRouter'
import authRoutes from './auth.router'
import usersRoutes from './users.router'
// import aboutRoutes from './aboutRouter'
import bannerRoutes from './banner.router'
import categoriesNewsRoutes from './categories-news.router'
import postsNewsRoutes from './posts-news.router'
import orderManageRoutes from './order-manage.router'
import categoriesProductRoutes from './categories-product.router'
import productRoutes from './product.router'
import addressRoutes from './addresses.router'
// import paymentTransactionRoutes from './admin/paymentTransactionRoutes'
import wishlistRoutes from './product.router'
import productReviewRouter from './product-review.router'
import voucherRouter from './voucher.router'
// import locationRoutes from './shared/locationRouter'

const router = Router()

router.use("/admin", adminRoutes)
router.use("/", sharedRoutes)

// router.use('/settings', settingRoutes)
// router.use('/fileManage', fileManageRoutes)
router.use('/auth', authRoutes)
router.use('/users', usersRoutes)

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
router.use('/voucher', voucherRouter)
// router.use('/location', locationRoutes)
router.use('/', wishlistRoutes)

export default router
