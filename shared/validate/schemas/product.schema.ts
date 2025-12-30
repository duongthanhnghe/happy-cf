import { z } from 'zod'

const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'ObjectId không hợp lệ')

const listImageSchema = z.object({
  id: z.string(),
  src: z.string().url('Ảnh không hợp lệ'),
})

const baseProductSchema = z.object({
  productName: z.string().min(1, 'Tên sản phẩm là bắt buộc').max(100, 'Tên sản phẩm không được vượt quá 100 ký tự'),
  description: z.string().max(5000, 'Mô tả không được vượt quá 5000 ký tự'),
  summaryContent: z.string().max(500, 'Tóm tắt không được vượt quá 500 ký tự'),
  price: z.coerce.number().positive('Giá phải > 0'),
  priceDiscounts: z.coerce.number().min(0, 'Giá khuyến mại ≥ 0'),
  amount: z.coerce.number().int().min(0, 'Số lượng ≥ 0'),
  weight: z.coerce.number().positive('Cân nặng phải > 0'),
  image: z.string().nonempty('Ảnh đại diện là bắt buộc').url('Ảnh không hợp lệ'),
  listImage: z.array(listImageSchema).optional().default([]),
  categoryId: objectIdSchema,
  sku: z.string().max(50, 'SKU không được vượt quá 50 ký tự').optional().default(''),
  isActive: z.coerce.boolean(),
  titleSEO: z.string().max(200, 'SEO Title không được vượt quá 200 ký tự').optional().default(''),
  descriptionSEO: z.string().max(160, 'SEO Description không được vượt quá 160 ký tự').optional().default(''),
  slug: z.string().min(1, 'Slug là bắt buộc').max(100, 'Slug không được vượt quá 100 ký tự'),
  keywords: z.preprocess(
    (val) => (val === undefined || val === null ? '' : String(val)),
    z.string().optional().default('')
  ),
  canonicalUrl: z.string().optional().default(''),
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

export const createProductSchema = baseProductSchema.merge(
  z.object({
    description: z.string().optional().default(''),
    summaryContent: z.string().optional().default(''),
    listImage: z.array(listImageSchema).optional().default([]),
    sku: z.string().optional().default(''),
    titleSEO: z.string().optional().default(''),
    descriptionSEO: z.string().optional().default(''),
    variantGroups: z.array(z.any()).optional().default([]),
    variantCombinations: z.array(z.any()).optional().default([]),
  })
).superRefine(validatePriceDiscounts)


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
  .superRefine(validatePriceDiscounts)

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