import { z } from 'zod'
import {
  imageSchema,
  isActiveSchema,
  objectIdSchema,
  orderSchema,
} from './common.schema'

export const pageSchema = z
  .string()
  .min(1, 'Trang hiển thị là bắt buộc')

export const positionSchema = z
  .string()
  .min(1, 'Vị trí hiển thị là bắt buộc')

export const linkSchema = z
  .string()
  .url('Link điều hướng không hợp lệ')
  .optional()
  .or(z.literal(''))

export const shortTextSchema = z
  .string()
  .max(100, 'Không được vượt quá 100 ký tự')
  .optional()

export const shortDescriptionSchema = z
  .string()
  .max(200, 'Không được vượt quá 200 ký tự')
  .optional()

export const baseImageBlockSchema = z.object({
  image: imageSchema,

  title: shortTextSchema,

  description: shortDescriptionSchema,

  textButton: shortTextSchema,

  linkRedirect: linkSchema,

  page: pageSchema,

  position: positionSchema,

  order: orderSchema,

  isActive: isActiveSchema,
})

export const createImageBlockSchema = baseImageBlockSchema.superRefine((data, ctx) => {
  if (data.textButton && !data.linkRedirect) {
    ctx.addIssue({
      path: ['linkRedirect'],
      message: 'Vui lòng nhập link điều hướng khi có text nút',
      code: z.ZodIssueCode.custom,
    })
  }
})


export const updateImageBlockSchema = baseImageBlockSchema.partial({
  image: true,
  title: true,
  description: true,
  textButton: true,
  linkRedirect: true,
  page: true,
  position: true,
  order: true,
  isActive: true,
}).superRefine((data, ctx) => {
  if (data.textButton && !data.linkRedirect) {
    ctx.addIssue({
      path: ['linkRedirect'],
      message: 'Vui lòng nhập link điều hướng khi có text nút',
      code: z.ZodIssueCode.custom,
    })
  }
})

export const imageBlockIdParamSchema = z.object({
  id: objectIdSchema,
})
