import { z } from 'zod'

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'ID danh mục không hợp lệ')

const baseCategorySchema = z.object({
  categoryName: z
    .string()
    .min(1, 'Tên danh mục là bắt buộc')
    .max(50, 'Tên danh mục không được vượt quá 50 ký tự'),

  description: z
    .string()
    .max(500, 'Mô tả không được vượt quá 500 ký tự')
    .optional()
    .default(''),

  image: z
    .string()
    .nonempty('Ảnh đại diện là bắt buộc')
    .url('Ảnh đại diện không hợp lệ'),

  banner: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().url('Banner không hợp lệ').optional()
  ),

  order: z
    .coerce
    .number()
    .int()
    .min(0, 'Thứ tự phải ≥ 0')
    .optional()
    .default(0),

  isActive: z.coerce.boolean().default(true),

  parentId: objectIdSchema.optional().nullable(),

  titleSEO: z
    .string()
    .min(1, 'SEO Title là bắt buộc')
    .max(200, 'SEO Title không được vượt quá 200 ký tự'),

  descriptionSEO: z
    .string()
    .max(160, 'SEO Description không được vượt quá 160 ký tự')
    .optional()
    .default(''),

  slug: z
    .string()
    .min(1, 'Slug là bắt buộc')
    .max(100, 'Slug không được vượt quá 100 ký tự')
    .regex(/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu gạch ngang'),

  keywords: z.preprocess(
    (val) =>
      typeof val === 'string'
        ? val.split(',').map(k => k.trim()).filter(Boolean)
        : [],
    z.array(z.string()).optional().default([])
  ),
})

export const createCategoryProductSchema = baseCategorySchema

export const updateCategoryProductSchema = baseCategorySchema.partial({
  description: true,
  banner: true,
  // order: true,
  parentId: true,
  titleSEO: true,
  descriptionSEO: true,
  keywords: true,
})

export const categoryIdParamSchema = z.object({
  id: objectIdSchema,
})
