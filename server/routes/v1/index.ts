import { Router } from 'express'

import adminRoutes from "./admin/index"
import sharedRoutes from "./shared/index"
import ImageBlockRoutes from './image-block.router'
import authRoutes from './auth.router'
import usersRoutes from './users.router'
import bannerRoutes from './banner.router'
import categoriesNewsRoutes from './categories-news.router'
import postsNewsRoutes from './posts-news.router'
import orderManageRoutes from './order-manage.router'
import categoriesProductRoutes from './categories-product.router'
import productRoutes from './product.router'
import variantGroupRoutes from './variant-group.routes'
import addressRoutes from './addresses.router'
import wishlistRoutes from './product.router'
import productReviewRouter from './product-review.router'
import voucherRouter from './voucher.router'
import fileManageRoutes from './file-manage.router'
import baseInformationRoutes from './base-information.router'
import paymentTransactionRoutes from './payment-transaction.routes'
import promotionGiftRouter from "./promotion-gift.route"
import flashSaleRouter from "./flash-sale.route"

const router = Router()

router.use("/admin", adminRoutes)
router.use("/", sharedRoutes)

router.use('/image-blocks', ImageBlockRoutes)
router.use('/auth', authRoutes)
router.use('/users', usersRoutes)

router.use('/banners', bannerRoutes)
router.use('/categoriesNews', categoriesNewsRoutes)
router.use('/newsPosts', postsNewsRoutes)
router.use('/orders', orderManageRoutes)
router.use('/payment-transactions', paymentTransactionRoutes)
router.use('/categories', categoriesProductRoutes)
router.use('/products', productRoutes)
router.use('/variant-groups', variantGroupRoutes)
router.use('/addresses', addressRoutes)
router.use('/product-reviews', productReviewRouter)
router.use('/voucher', voucherRouter)
router.use('/fileManage', fileManageRoutes)
router.use('/base-information', baseInformationRoutes)
router.use("/promotion-gift", promotionGiftRouter)
router.use("/flash-sales", flashSaleRouter)
router.use('/', wishlistRoutes)

export default router
