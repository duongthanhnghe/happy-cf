import { Router } from 'express';
import settingRoutes from './setting.router.js';
// import fileManageRoutes from './fileManageRouter.js'
// import authRoutes from './authRouter.js'
import aboutRoutes from './about.router.js';
import usersRouter from './users.router.js';
import bannerRoutes from './banner.router.js';
import categoriesNewsRoutes from './categories-news.router.js';
import postsNewsRoutes from './posts-news.router.js';
import orderManageRoutes from './order-manage.router.js';
import categoriesProductRoutes from './categories-product.router.js';
import productRoutes from './product.router.js';
import variantGroupRoutes from './variant-group.routes.js';
// import addressRoutes from './addressesRouter.js'
import paymentTransactionRoutes from './payment-transaction.routes.js';
// import wishlistRoutes from './productRouter.js'
import productReviewRouter from './product-review.router.js';
import voucherRouter from './voucher.router.js';
import voucherUsageRouter from './voucher-usage.router.js';
import accountRouter from './account.router.js';
// import locationRoutes from './locationRouter.js'
const router = Router();
router.use('/account', accountRouter);
router.use('/settings', settingRoutes);
// router.use('/fileManage', fileManageRoutes)
// router.use('/auth', authRoutes)
router.use('/about', aboutRoutes);
router.use('/users', usersRouter);
router.use('/banners', bannerRoutes);
router.use('/categoriesNews', categoriesNewsRoutes);
router.use('/newsPosts', postsNewsRoutes);
router.use('/orders', orderManageRoutes);
router.use('/payment-transactions', paymentTransactionRoutes);
router.use('/categories', categoriesProductRoutes);
router.use('/products', productRoutes);
router.use('/variant-groups', variantGroupRoutes);
// router.use('/addresses', addressRoutes)
router.use('/product-reviews', productReviewRouter);
router.use('/voucher', voucherRouter);
router.use('/voucher-usage', voucherUsageRouter);
// router.use('/location', locationRoutes)
// router.use('/', wishlistRoutes)
export default router;
//# sourceMappingURL=index.js.map