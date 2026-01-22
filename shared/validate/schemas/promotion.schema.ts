import { z } from 'zod'
import {
  objectIdSchema,
  isActiveSchema,
} from './common.schema'

export const promotionGiftItemSchema = z.object({
  productId: objectIdSchema,
  quantity: z
    .number()
    .int('Số lượng phải là số nguyên')
    .min(1, 'Số lượng quà tặng tối thiểu là 1'),
})

export const basePromotionGiftObjectSchema = z.object({
  name: z
    .string()
    .min(1, 'Tên CTKM là bắt buộc')
    .max(200, 'Tên CTKM không vượt quá 200 ký tự'),

  description: z.string().optional(),

  isActive: isActiveSchema,

  minOrderValue: z
    .number()
    .min(0, 'Giá trị đơn hàng tối thiểu không hợp lệ'),

  requiredProducts: z
    .array(objectIdSchema)
    .optional(),

  requiredCategories: z
    .array(objectIdSchema)
    .optional(),

  startDate: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: 'Ngày bắt đầu không hợp lệ',
    }),

  endDate: z
    .string()
    .refine(val => !isNaN(Date.parse(val)), {
      message: 'Ngày kết thúc không hợp lệ',
    }),

  // ===== Quà tặng =====
  gifts: z
    .array(promotionGiftItemSchema)
    .min(1, 'Phải có ít nhất 1 quà tặng'),

  // ===== Giới hạn =====
  usageLimit: z
    .number()
    .int()
    .min(0, 'Số lượt dùng không hợp lệ'),

  stackable: z.boolean(),
})

export const basePromotionGiftSchema = basePromotionGiftObjectSchema.refine(
  data => new Date(data.startDate) <= new Date(data.endDate),
  {
    message: 'Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu',
    path: ['endDate'],
  }
)

export const createPromotionGiftSchema = basePromotionGiftSchema

export const updatePromotionGiftSchema = basePromotionGiftObjectSchema.partial({
  name: true,
  description: true,
  isActive: true,
  minOrderValue: true,
  requiredProducts: true,
  requiredCategories: true,
  startDate: true,
  endDate: true,
  gifts: true,
  usageLimit: true,
  stackable: true,
})

export const promotionGiftIdParamSchema = z.object({
  id: objectIdSchema,
})
