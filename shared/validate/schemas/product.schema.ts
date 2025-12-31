import { z } from 'zod'
import { canonicalUrlSchema, descriptionSchema, descriptionSEOSchema, imageSchema, isActiveSchema, keywordsSEOSchema, listImageSchema, objectIdSchema, slugSchema, summaryContentSchema, titleSEOSchema, validateSEO } from './common.schema'

const baseProductSchema = z.object({
  productName: z.string().min(1, 'Tên sản phẩm là bắt buộc').max(100, 'Tên sản phẩm không được vượt quá 100 ký tự'),
  description: descriptionSchema,
  summaryContent: summaryContentSchema,
  price: z.coerce.number().positive('Giá phải > 0'),
  priceDiscounts: z.coerce.number().min(0, 'Giá khuyến mại ≥ 0'),
  amount: z.coerce.number().int().min(0, 'Số lượng ≥ 0'),
  weight: z.coerce.number().positive('Cân nặng phải > 0'),
  image: imageSchema,
  listImage: listImageSchema,
  categoryId: objectIdSchema,
  sku: z.string().max(50, 'SKU không được vượt quá 50 ký tự').optional().default(''),
  isActive: isActiveSchema,

  titleSEO: titleSEOSchema,
  descriptionSEO: descriptionSEOSchema,
  slug: slugSchema,
  keywords: keywordsSEOSchema,
  canonicalUrl: canonicalUrlSchema,

  variantGroups: z.array(z.any()).optional().default([]),
  variantCombinations: z.array(z.any()).optional().default([]),
})

const validatePriceDiscounts = (data: any, ctx: any) => {
  if (data.priceDiscounts !== undefined && data.price !== undefined) {
    if (data.priceDiscounts > data.price) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['priceDiscounts'],
        message: 'Giá khuyến mại không được lớn hơn giá gốc',
      })
    }
  }
}

export const createProductSchema = baseProductSchema.superRefine(validatePriceDiscounts).superRefine(validateSEO)

export const updateProductSchema = baseProductSchema
  .partial({
    listImage: true,
    description: true,
    sku: true,
    summaryContent: true,
    titleSEO: true,
    descriptionSEO: true,
    keywords: true,
    canonicalUrl: true,
    variantGroups: true,
    variantCombinations: true,
  })
  .superRefine(validatePriceDiscounts).superRefine(validateSEO)

export const productIdParamSchema = z.object({
  id: objectIdSchema,
})

export const objectIdParamSchema = z.object({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ObjectId không hợp lệ')
});

export const deleteProductsSchema = z.object({
  ids: z.array(z.string().regex(/^[0-9a-fA-F]{24}$/)).nonempty('Danh sách sản phẩm không hợp lệ')
});

export const productUpdateImportSchema = baseProductSchema.extend({
  id: z.string().regex(/^[0-9a-fA-F]{24}$/, 'ID sản phẩm không hợp lệ')
});