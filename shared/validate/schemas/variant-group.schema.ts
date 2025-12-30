import { z } from 'zod'
import { objectIdSchema } from './common.schema'

export const variantItemSchema = z.object({
  id: z.string().min(1, 'ID biến thể là bắt buộc'),
  name: z
    .string()
    .min(1, 'Tên biến thể là bắt buộc')
    .max(100, 'Tên biến thể không được vượt quá 100 ký tự'),
  isActive: z.coerce.boolean().default(true),
})

export const createVariantGroupSchema = z.object({
  groupName: z
    .string()
    .min(1, 'Tên nhóm biến thể là bắt buộc')
    .max(100, 'Tên nhóm không được vượt quá 100 ký tự'),

  groupType: z
    .string()
    .min(1, 'Loại nhóm là bắt buộc')
    .regex(/^[a-zA-Z0-9-_]+$/, 'Loại nhóm không được chứa ký tự đặc biệt'),

  description: z.string().optional().default(''),

  icon: z.string().optional().default(''),

  hasImage: z.coerce.boolean().default(false),

  isActive: z.coerce.boolean().default(true),

  variants: z
    .array(variantItemSchema)
    .min(1, 'Phải có ít nhất 1 biến thể'),
})

export const updateVariantGroupSchema = createVariantGroupSchema.partial()

export const idParamSchema = z.object({
  id: objectIdSchema,
})