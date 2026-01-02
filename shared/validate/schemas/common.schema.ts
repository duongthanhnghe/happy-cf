import { z } from 'zod'
import {
  EMAIL_REGEX,
  PHONE_REGEX,
  NO_SPECIAL_CHAR_REGEX
} from '../../constants/regex'

export const objectIdSchema = z
  .string()
  .regex(/^[0-9a-fA-F]{24}$/, 'ID không hợp lệ')

export const imageSchema = z
  .string()
  .nonempty('Ảnh đại diện là bắt buộc')
  .url('Ảnh đại diện không hợp lệ')

export const imageOptionalSchema = z.preprocess(
  (val) => {
    if (val === '' || val === null || val === undefined) return undefined
    return val
  },
  z.string().url('Ảnh đại diện không hợp lệ').optional()
)

const listImage = z.object({
  id: z.string(),
  src: z.string().url('Ảnh không hợp lệ'),
})

export const listImageSchema = z
  .array(listImage)
  .optional()
  .default([])

export const summaryContentSchema = z
  .string()
  .max(500, 'Mô tả ngắn không được vượt quá 500 ký tự')
  .optional()
  .default('')

export const descriptionSchema = z
  .string()
  .max(5000, 'Mô tả không được vượt quá 5000 ký tự')
  .optional()
  .default('')

export const orderSchema = z
  .coerce
  .number()
  .int()
  .min(0, 'Thứ tự phải ≥ 0')
  .optional()
  .default(0)

export const isActiveSchema = z.coerce.boolean()
  
export const slugSchema = z
  .string()
  .min(1, 'Slug là bắt buộc')
  .regex(/^[a-z0-9-]+$/, 'Slug chỉ được chứa chữ thường, số và dấu -')

export const titleSEOSchema = z
  .string()
  .min(1, 'SEO Title là bắt buộc')
  .max(200, 'SEO Title không được vượt quá 200 ký tự')

export const descriptionSEOSchema = z
  .string()
  .max(160, 'SEO Description không được vượt quá 160 ký tự')
  .optional()

export const keywordsSEOSchema = z.preprocess(
    (val) => (val === undefined || val === null ? '' : String(val)),
    z.string().optional().default('')
  )


export const canonicalUrlSchema = z.string().optional().default('')

export const validateSEO = (data: any, ctx: any) => {
  const hasTitle =
    data.categoryName || data.title || data.name

  if (hasTitle && !data.titleSEO) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['titleSEO'],
      message: 'Nên nhập SEO Title để tối ưu tìm kiếm',
    })
  }

  if (!data.descriptionSEO) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['descriptionSEO'],
      message: 'Nên nhập SEO Description để tối ưu tìm kiếm',
    })
  }
}

export const emailSchema = z
  .string()
  .min(1, 'Email không được để trống')
  .regex(EMAIL_REGEX, 'Email không hợp lệ')

export const phoneSchema = z
  .string()
  .min(1, 'Nội dung không được trống')
  .regex(PHONE_REGEX, 'Số điện thoại phải có ít nhất 10 số')

export const phoneOptionalSchema = z
  .string()
  .regex(PHONE_REGEX, 'Số điện thoại phải có ít nhất 10 số')
  .optional()
  .nullable()

export const strongPasswordSchema = z
  .string()
  .min(1, 'Mật khẩu không được để trống')
  .min(8, 'Mật khẩu phải có ít nhất 8 ký tự')
  .regex(/[A-Z]/, 'Phải có ít nhất 1 chữ in hoa')
  .regex(/[a-z]/, 'Phải có ít nhất 1 chữ thường')
  .regex(/[0-9]/, 'Phải có ít nhất 1 số')
  .regex(/[^A-Za-z0-9]/, 'Phải có ít nhất 1 ký tự đặc biệt')