import { connectDB } from './db/db.js';
import path from 'path';
import cors from 'cors';
import express from 'express';
import { fileURLToPath } from 'url';
import * as dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import fileManageRoutes from './routes/fileManageRouter.js';
import settingRoutes from './routes/settingRouter.js';
import authRoutes from './routes/authRouter.js';
import aboutRoutes from './routes/aboutRouter.js';
import bannerRoutes from './routes/bannerRouter.js';
import categoriesNewsRoutes from './routes/categoriesNewsRouter.js';
import postsNewsRoutes from './routes/postsNewsRouter.js';
import orderManageRoutes from './routes/orderManageRouter.js';
import categoriesProductRoutes from './routes/categoriesProductRouter.js';
import productRoutes from './routes/productRouter.js';
import addressRoutes from './routes/addressesRouter.js';
import paymentTransactionRoutes from './routes/paymentTransactionRoutes.js';
import wishlistRoutes from './routes/productRouter.js';
import productReviewRouter from "./routes/productReviewRouter.js";
import { v2 as cloudinary } from 'cloudinary';
dotenv.config({ path: path.resolve(process.cwd(), '.env') });
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
const app = express();
const PORT = Number(process.env.PORT);
const HOST = process.env.HOST || '0.0.0.0';
const barcodePath = fileURLToPath(new URL('./public/barcodes', import.meta.url));
app.use(cors({
    // origin: process.env.DOMAIN,
    origin: "*",
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));
app.use((req, res, next) => {
    console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
    console.log('Request body:', req.body);
    next();
});
await connectDB();
app.use(cookieParser());
app.use('/barcodes', express.static(barcodePath));
app.use('/api/settings', express.json(), settingRoutes);
app.use('/api/fileManage', express.json(), fileManageRoutes);
app.use('/api/auth', express.json(), authRoutes);
app.use('/api/about', express.json(), aboutRoutes);
app.use('/api/banners', express.json(), bannerRoutes);
app.use('/api/categoriesNews', express.json(), categoriesNewsRoutes);
app.use('/api/newsPosts', express.json(), postsNewsRoutes);
app.use('/api/orders', express.json(), orderManageRoutes);
app.use('/api/payment-transactions', express.json(), paymentTransactionRoutes);
app.use('/api/categories', express.json(), categoriesProductRoutes);
app.use('/api/products', express.json(), productRoutes);
app.use('/api/addresses', express.json(), addressRoutes);
app.use("/api/product-reviews", productReviewRouter);
app.use('/api', express.json(), wishlistRoutes);
// Error handler
app.use((err, _req, res, _next) => {
    console.error('Server error:', err);
    res.status(500).json({
        success: false,
        message: err instanceof Error ? err.message : 'Internal Server Error',
        error: process.env.NODE_ENV === 'development' && err instanceof Error
            ? err.stack
            : undefined
    });
});
// Start server
app.listen(PORT, HOST, (err) => {
    if (err) {
        console.error('Failed to start server:', err);
        process.exit(1);
    }
    console.log(`Server running at http://${HOST}:${PORT}/api`);
});
//# sourceMappingURL=index.js.map