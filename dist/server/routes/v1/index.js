import { Router } from 'express';
import adminRoutes from "./admin/index.js";
import sharedRoutes from "./shared/index.js";
// import settingRoutes from './admin/settingRouter.js'
// import fileManageRoutes from './shared/fileManageRouter.js'
import authRoutes from './authRouter.js';
import usersRoutes from './usersRouter.js';
// import aboutRoutes from './aboutRouter.js'
import bannerRoutes from './bannerRouter.js';
import categoriesNewsRoutes from './categoriesNewsRouter.js';
import postsNewsRoutes from './postsNewsRouter.js';
import orderManageRoutes from './orderManageRouter.js';
import categoriesProductRoutes from './categoriesProductRouter.js';
import productRoutes from './productRouter.js';
import addressRoutes from './addressesRouter.js';
// import paymentTransactionRoutes from './admin/paymentTransactionRoutes.js'
import wishlistRoutes from './productRouter.js';
import productReviewRouter from './productReviewRouter.js';
import voucherRouter from './voucherRouter.js';
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