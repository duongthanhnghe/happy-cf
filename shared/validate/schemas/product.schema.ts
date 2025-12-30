import { z } from 'zod'

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'ObjectId không hợp lệ')

const listImageSchema = z.object({
  id: z.string(),
  src: z.string().url(),
})

export const createProductSchema = z.object({
  productName: z.string().min(1, 'Tên sản phẩm là bắt buộc'),

  description: z.string().optional().default(''),
  summaryContent: z.string().optional().default(''),

  price: z.coerce.number().positive('Giá phải > 0'),
  priceDiscounts: z.coerce.number().min(0),
  amount: z.coerce.number().int().min(0),
  weight: z.coerce.number().positive(),

  image: z.string().url('Ảnh không hợp lệ'),
  listImage: z.array(listImageSchema).optional().default([]),

  categoryId: objectIdSchema,

  sku: z.string().optional().default(''),

  isActive: z.coerce.boolean().default(true),

  titleSEO: z.string().optional().default(''),
  descriptionSEO: z.string().optional().default(''),

  slug: z.string().min(1, 'Slug là bắt buộc'),

  keywords: z
    .union([
      z.array(z.string()),
      z.string().transform(v =>
        v.split(',').map(k => k.trim()).filter(Boolean)
      ),
    ])
    .optional(),

  canonicalUrl: z.string().url().optional(),

  // advanced
  variantGroups: z.array(z.any()).optional().default([]),
  variantCombinations: z.array(z.any()).optional().default([]),
})

export const updateProductSchema = z.object({
  productName: z.string().min(1).optional(),

  description: z.string().optional(),
  summaryContent: z.string().optional(),

  price: z.coerce.number().positive().optional(),
  priceDiscounts: z.coerce.number().min(0).optional(),
  amount: z.coerce.number().int().min(0).optional(),
  weight: z.coerce.number().positive().optional(),

  image: z.string().url().optional(),
  listImage: z.array(listImageSchema).optional(),

  categoryId: objectIdSchema.optional(),

  sku: z.string().optional(),
  isActive: z.coerce.boolean().optional(),

  titleSEO: z.string().optional(),
  descriptionSEO: z.string().optional(),

  slug: z.string().min(1).optional(),

  keywords: z
    .union([
      z.array(z.string()),
      z.string().transform(v =>
        v.split(',').map(k => k.trim()).filter(Boolean)
      ),
    ])
    .optional(),

  canonicalUrl: z.string().url().optional(),

  variantGroups: z.array(z.any()).optional(),
  variantCombinations: z.array(z.any()).optional(),
})

export const productIdParamSchema = z.object({
  id: objectIdSchema,
})

export const productListQuerySchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().optional(),
  search: z.string().optional(),
  categoryId: objectIdSchema.optional(),
})
