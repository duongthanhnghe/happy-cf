import { z } from 'zod'
import {
  objectIdSchema,
  listImageSchema,
} from './common.schema'

export const ratingSchema = z
  .number({
    required_error: 'Vui lòng chọn số sao',
    invalid_type_error: 'Số sao không hợp lệ',
  })
  .min(1, 'Vui lòng chọn ít nhất 1 sao')
  .max(5, 'Số sao tối đa là 5')

export const createProductReviewSchema = z.object({
  reviewId: objectIdSchema,
  rating: ratingSchema,
  comment: z
    .string()
    .min(1, 'Nội dung đánh giá không được để trống')
    .max(1000, 'Nội dung đánh giá không được vượt quá 1000 ký tự'),

  images: z.array(listImageSchema).optional(),
})

export const reviewIdParamSchema = z.object({
  id: objectIdSchema,
})
