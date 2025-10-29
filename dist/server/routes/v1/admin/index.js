import { Router } from 'express';
import settingRoutes from './settingRouter.js';
// import fileManageRoutes from './fileManageRouter.js'
// import authRoutes from './authRouter.js'
import aboutRoutes from './aboutRouter.js';
import usersRouter from './usersRouter.js';
import bannerRoutes from './bannerRouter.js';
import categoriesNewsRoutes from './categoriesNewsRouter.js';
import postsNewsRoutes from './postsNewsRouter.js';
import orderManageRoutes from './orderManageRouter.js';
import categoriesProductRoutes from './categoriesProductRouter.js';
import productRoutes from './productRouter.js';
// import addressRoutes from './addressesRouter.js'
import paymentTransactionRoutes from './paymentTransactionRoutes.js';
// import wishlistRoutes from './productRouter.js'
import productReviewRouter from './productReviewRouter.js';
import voucherRouter from './voucherRouter.js';
import voucherUsageRouter from './voucherUsageRouter.js';
// import locationRoutes from './locationRouter.js'
const router = Router();
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
// router.use('/addresses', addressRoutes)
router.use('/product-reviews', productReviewRouter);
router.use('/voucher', voucherRouter);
router.use('/voucher-usage', voucherUsageRouter);
// router.use('/location', locationRoutes)
// router.use('/', wishlistRoutes)
export default router;
//# sourceMappingURL=index.js.map