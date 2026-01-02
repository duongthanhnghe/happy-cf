import { z } from 'zod'
import {
  imageSchema,
  isActiveSchema,
  orderSchema,
} from './common.schema'

export const baseBannerSchema = z.object({
  title: z
    .string()
    .min(1, 'Tiêu đề banner là bắt buộc')
    .max(200, 'Tiêu đề banner không được vượt quá 200 ký tự'),

  description: z
    .string()
    .optional()
    .default(''),

  image: imageSchema,

  order: orderSchema.optional().default(0),

  isActive: isActiveSchema,
})

export const createBannerSchema = baseBannerSchema

export const updateBannerSchema = baseBannerSchema.partial({
  title: true,
  description: true,
  image: true,
  order: true,
  isActive: true,
})

export const bannerIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID banner không hợp lệ'),
})
