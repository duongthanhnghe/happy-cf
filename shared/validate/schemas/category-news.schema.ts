import { z } from 'zod'
import { descriptionSchema, descriptionSEOSchema, imageOptionalSchema, isActiveSchema, keywordsSEOSchema, objectIdSchema, orderSchema, slugSchema, summaryContentSchema, titleSEOSchema, validateSEO } from './common.schema'

export const baseCategoryNewsSchema = z.object({
  categoryName: z
    .string()
    .min(1, 'Tên danh mục là bắt buộc')
    .max(200, 'Tên danh mục không được vượt quá 200 ký tự'),

  description: descriptionSchema,

  summaryContent: summaryContentSchema,

  image: imageOptionalSchema,

  order: orderSchema,

  isActive: isActiveSchema,

  titleSEO: titleSEOSchema,

  descriptionSEO: descriptionSEOSchema,

  slug: slugSchema,

  keywords: keywordsSEOSchema,

})

export const createCategoryNewsSchema =
  baseCategoryNewsSchema.superRefine(validateSEO)

export const updateCategoryNewsSchema = baseCategoryNewsSchema
  .partial({
    categoryName: true,
    description: true,
    summaryContent: true,
    image: true,
    order: true,
    isActive: true,
    titleSEO: true,
    descriptionSEO: true,
    slug: true,
    keywords: true,
  })
  .superRefine(validateSEO)

export const categoryNewsIdParamSchema = z.object({
  id: objectIdSchema,
})