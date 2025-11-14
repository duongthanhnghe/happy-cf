import express, { type Request, type Response, type NextFunction } from 'express'
import cors from 'cors'
import cookieParser from 'cookie-parser'
import path from 'path'
import { fileURLToPath } from 'url'
import * as dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import { connectDB } from './db/db'

// Load env
dotenv.config({ path: path.resolve(process.cwd(), '.env') })

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

const app = express()
const PORT = Number(process.env.PORT) || 8080
const HOST = process.env.HOST || '0.0.0.0'
const barcodePath = fileURLToPath(new URL('./public/barcodes', import.meta.url))

// --- Middleware ---
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5000',
    'http://0.0.0.0:3000',
    'http://192.168.1.113:3000',
    'http://192.168.2.161:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ["Set-Cookie"],
}))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ extended: true, limit: '50mb' }))
app.use(cookieParser())
app.use('/barcodes', express.static(barcodePath))

// --- Logger (optional) ---
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`)
  next()
})

// --- Database ---
await connectDB()

import v1Routes from './routes/v1/index'

app.use('/api/v1', v1Routes)

// --- Error handler ---
app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  console.error('Server error:', err)
  res.status(500).json({
    success: false,
    message: err instanceof Error ? err.message : 'Internal Server Error',
    error:
      process.env.NODE_ENV === 'development' && err instanceof Error
        ? err.stack
        : undefined,
  })
})

// --- Start server ---
app.listen(PORT, HOST, () => {
  console.log(`✅ Server running at http://${HOST}:${PORT}/api/v1`)
})
