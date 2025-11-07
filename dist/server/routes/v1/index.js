import { Router } from 'express';
import adminRoutes from "./admin/index.js";
import sharedRoutes from "./shared/index.js";
// import settingRoutes from './admin/settingRouter.js'
// import fileManageRoutes from './shared/fileManageRouter.js'
import authRoutes from './auth.router.js';
import usersRoutes from './users.router.js';
// import aboutRoutes from './aboutRouter.js'
import bannerRoutes from './banner.router.js';
import categoriesNewsRoutes from './categories-news.router.js';
import postsNewsRoutes from './posts-news.router.js';
import orderManageRoutes from './order-manage.router.js';
import categoriesProductRoutes from './categories-product.router.js';
import productRoutes from './product.router.js';
import addressRoutes from './addresses.router.js';
// import paymentTransactionRoutes from './admin/paymentTransactionRoutes.js'
import wishlistRoutes from './product.router.js';
import productReviewRouter from './product-review.router.js';
import voucherRouter from './voucher.router.js';
// import locationRoutes from './shared/locationRouter.js'
const router = Router();
router.use("/admin", adminRoutes);
router.use("/", sharedRoutes);
// router.use('/settings', settingRoutes)
// router.use('/fileManage', fileManageRoutes)
router.use('/auth', authRoutes);
router.use('/users', usersRoutes);
// router.use('/about', aboutRoutes)
router.use('/banners', bannerRoutes);
router.use('/categoriesNews', categoriesNewsRoutes);
router.use('/newsPosts', postsNewsRoutes);
router.use('/orders', orderManageRoutes);
// router.use('/payment-transactions', paymentTransactionRoutes)
router.use('/categories', categoriesProductRoutes);
router.use('/products', productRoutes);
router.use('/addresses', addressRoutes);
router.use('/product-reviews', productReviewRouter);
router.use('/voucher', voucherRouter);
// router.use('/location', locationRoutes)
router.use('/', wishlistRoutes);
export default router;
//# sourceMappingURL=index.js.map