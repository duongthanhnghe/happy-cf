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
router.use('/categories', categoriesProductRoutes)
router.use('/products', productRoutes)
router.use('/variant-groups', variantGroupRoutes)
router.use('/addresses', addressRoutes)
router.use('/product-reviews', productReviewRouter)
router.use('/voucher', voucherRouter)
router.use('/', wishlistRoutes)
router.use('/fileManage', fileManageRoutes)

export default router
