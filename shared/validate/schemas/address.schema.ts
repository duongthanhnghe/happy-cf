import { z } from 'zod'
import { objectIdSchema, phoneSchema, requiredString } from './common.schema'
import { ADDRESS_TAG } from '@/shared/constants/address-tag'

export const baseAddressSchema = z.object({
  // userId: objectIdSchema,

  fullname: requiredString('Họ và tên', 100),

  phone: phoneSchema,

  address: requiredString('Địa chỉ', 255),

  note: z.string().max(255).optional(),

  tag: z.enum([
    ADDRESS_TAG.HOME,
    ADDRESS_TAG.OFFICE,
    ADDRESS_TAG.SCHOOL,
    ADDRESS_TAG.OTHER,
  ]),

  isDefault: z.boolean().optional(),

  provinceCode: z
    .number()
    .int()
    .positive('Mã tỉnh không hợp lệ'),

  districtCode: z
    .number()
    .int()
    .positive('Mã quận/huyện không hợp lệ'),

  wardCode: z
    .number()
    .int()
    .positive('Mã phường/xã không hợp lệ'),
})

export const createAddressSchema = baseAddressSchema

export const updateAddressSchema = createAddressSchema.partial({
  isDefault: true,
})

export const addressIdParamSchema = z.object({
  id: objectIdSchema,
})
