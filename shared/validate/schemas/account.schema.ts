import { z } from 'zod'
import { emailSchema, strongPasswordSchema, objectIdSchema } from './common.schema'
import { ACCOUNT_ROLES } from '@/server/types/dto/v1/account.dto'

export const accountRoleSchema = z.enum(
  ACCOUNT_ROLES
)

export const createAccountSchema = z.object({
  fullname: z
    .string()
    .min(1, 'Họ và tên không được để trống'),

  email: emailSchema,

  password: strongPasswordSchema,

  role: accountRoleSchema,
})

export const updateAccountSchema = z.object({
  avatar: z.string().url('Avatar không hợp lệ').optional().nullable(),

  fullname: z
    .string()
    .min(1, 'Họ và tên không được để trống'),
})

export const idParamSchema = z.object({
  id: objectIdSchema,
})

export const loginSchema = z.object({
  email: emailSchema,
  password: strongPasswordSchema,
})

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: strongPasswordSchema,
})

export const changePasswordFESchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: strongPasswordSchema,
  newPasswordConfirm: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
}).superRefine((data, ctx) => {
    if (data.newPassword !== data.newPasswordConfirm) {
      ctx.addIssue({
        path: ['newPasswordConfirm'],
        message: 'Mật khẩu xác nhận không khớp',
        code: z.ZodIssueCode.custom,
      })
    }
  })