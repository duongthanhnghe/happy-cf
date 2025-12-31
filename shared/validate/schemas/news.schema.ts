import { z } from 'zod'
import { canonicalUrlSchema, descriptionSEOSchema, imageSchema, isActiveSchema, keywordsSEOSchema, objectIdSchema, orderSchema, slugSchema, summaryContentSchema, titleSEOSchema, validateSEO } from './common.schema'

export const basePostNewsSchema = z.object({
  title: z
    .string()
    .min(1, 'Tên bài viết là bắt buộc')
    .max(200, 'Tên bài viết không được vượt quá 200 ký tự'),

  summaryContent: summaryContentSchema,

  description: z
    .string()
    .min(1, 'Nội dung bài viết là bắt buộc'),

  image: imageSchema,

  categoryId: objectIdSchema,

  isActive: isActiveSchema,

  titleSEO: titleSEOSchema,

  descriptionSEO: descriptionSEOSchema,

  slug: slugSchema,

  keywords: keywordsSEOSchema,

  canonicalUrl: canonicalUrlSchema,
})

export const createPostNewsSchema =
  basePostNewsSchema.superRefine(validateSEO)

export const updatePostNewsSchema = basePostNewsSchema
  .partial({
    title: true,
    summaryContent: true,
    description: true,
    image: true,
    categoryId: true,
    isActive: true,
    titleSEO: true,
    descriptionSEO: true,
    slug: true,
    keywords: true,
    canonicalUrl: true,
  })
  .superRefine(validateSEO)

export const postNewsIdParamSchema = z.object({
    id: objectIdSchema,
  })