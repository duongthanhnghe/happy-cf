import { z } from 'zod'
import { imageSchema, isActiveSchema, listImageSchema, objectIdSchema, orderSchema, summaryContentSchema } from './common.schema'

export const baseAboutSchema = z.object({
  title: z
    .string()
    .min(1, 'Tiêu đề là bắt buộc')
    .max(200, 'Tiêu đề không được vượt quá 200 ký tự'),

  summaryContent: summaryContentSchema.optional(),

  description: z.string().optional(),

  image: imageSchema,

  listImage: z.array(listImageSchema).optional(),

  order: orderSchema.optional(),

  isActive: isActiveSchema,
})

export const createAboutSchema = baseAboutSchema

export const updateAboutSchema = baseAboutSchema.partial({
  title: true,
  summaryContent: true,
  description: true,
  image: true,
  listImage: true,
  order: true,
  isActive: true,
})

export const aboutIdParamSchema = z.object({
  id: objectIdSchema,
})