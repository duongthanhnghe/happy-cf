import { Router } from 'express'

import settingRoutes from './setting.router'
import iTranslationRoutes from './itranslation.routes'
import ImageBlockRoutes from './image-block.router'
import aboutRoutes from './about.router'
import usersRouter from './users.router'
import bannerRoutes from './banner.router'
import categoriesNewsRoutes from './categories-news.router'
import postsNewsRoutes from './posts-news.router'
import orderManageRoutes from './order-manage.router'
import categoriesProductRoutes from './categories-product.router'
import productRoutes from './product.router'
import variantGroupRoutes from './variant-group.routes'
import paymentTransactionRoutes from './payment-transaction.routes'
import productReviewRouter from './product-review.router'
import voucherRouter from './voucher.router'
import voucherUsageRouter from './voucher-usage.router'
import accountRouter from './account.router'

const router = Router()

router.use('/itranslation', iTranslationRoutes)
router.use('/image-blocks', ImageBlockRoutes)
router.use('/account', accountRouter)
router.use('/settings', settingRoutes)
router.use('/about', aboutRoutes)
router.use('/users', usersRouter)
router.use('/banners', bannerRoutes)
router.use('/categoriesNews', categoriesNewsRoutes)
router.use('/newsPosts', postsNewsRoutes)
router.use('/orders', orderManageRoutes)
router.use('/payment-transactions', paymentTransactionRoutes)
router.use('/categories', categoriesProductRoutes)
router.use('/products', productRoutes)
router.use('/variant-groups', variantGroupRoutes)
router.use('/product-reviews', productReviewRouter)
router.use('/voucher', voucherRouter)
router.use('/voucher-usage', voucherUsageRouter)

export default router
