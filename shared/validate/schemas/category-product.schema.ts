import { z } from 'zod'
import { canonicalUrlSchema, descriptionSchema, descriptionSEOSchema, imageSchema, isActiveSchema, keywordsSEOSchema, objectIdSchema, orderSchema, slugSchema, titleSEOSchema, validateSEO } from './common.schema'

const baseCategorySchema = z.object({
  categoryName: z
    .string()
    .min(1, 'Tên danh mục là bắt buộc')
    .max(50, 'Tên danh mục không được vượt quá 50 ký tự'),

  description: descriptionSchema,
    
  image: imageSchema,

  banner: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().url('Banner không hợp lệ').optional()
  ),

  order: orderSchema,
  
  isActive: isActiveSchema,

  parentId: objectIdSchema.optional().nullable(),

  titleSEO: titleSEOSchema,

  slug: slugSchema,
  
  keywords: keywordsSEOSchema,

  canonicalUrl: canonicalUrlSchema,

  descriptionSEO: descriptionSEOSchema,
  
})

export const createCategoryProductSchema = baseCategorySchema.superRefine(validateSEO)

export const updateCategoryProductSchema = baseCategorySchema.partial({
  description: true,
  banner: true,
  parentId: true,
  titleSEO: true,
  descriptionSEO: true,
  keywords: true,
}).superRefine(validateSEO)

export const categoryIdParamSchema = z.object({
  id: objectIdSchema,
})
