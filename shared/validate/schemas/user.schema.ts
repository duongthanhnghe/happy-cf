import { z } from 'zod'
import { 
  objectIdSchema,
  emailSchema,
  phoneOptionalSchema,
  strongPasswordSchema
} from './common.schema'

export const idParamSchema = z.object({
  id: objectIdSchema,
})

export const genderSchema = z.enum(['male', 'female', 'other'])

export const authProviderSchema = z.enum(['local', 'google', 'facebook'])

export const membershipSchema = z.object({
  level: z.enum(['Bronze', 'Silver', 'Gold', 'Platinum']),
  point: z.number().min(0).default(0),
  balancePoint: z.number().min(0).default(0),
  discountRate: z.number().min(0).max(100).default(0),
  pointRate: z.number().min(0).default(0.01),
  joinedAt: z.coerce.date().optional(),
  barcode: z.string().optional().nullable(),
  code: z.number().optional().nullable(),
})

export const loginSchema = z.object({
  email: emailSchema,
  password: strongPasswordSchema,
})

export const registerSchema = z.object({
  fullname: z
    .string()
    .min(1, 'Họ tên là bắt buộc'),

  email: emailSchema,

  password: strongPasswordSchema,

  gender: genderSchema.optional().default('other'),

  authProvider: authProviderSchema
    .optional()
    .default('local'),
})

export const createUserSchema = z.object({
  fullname: z.string().min(1),
  email: emailSchema,
  password: strongPasswordSchema,

  gender: genderSchema.optional(),
  phone: phoneOptionalSchema,
  birthday: z.coerce.date().optional().nullable(),
  avatar: z.string().optional().nullable(),

  role: z.number().optional().default(0),
  active: z.boolean().default(true),

  authProvider: authProviderSchema.default('local'),
  googleId: z.string().optional().nullable(),

  membership: membershipSchema,
})

export const changePasswordSchema = z.object({
  oldPassword: z.string().min(8),
  newPassword: z.string().min(8),
})

export const forgotPasswordSchema = z.object({
  email: z.string().email(),
})

export const resetPasswordSchema = z.object({
  oldPassword: z.string().min(8),
  password: strongPasswordSchema,
  passwordConfirm: z.string().min(1, 'Vui lòng xác nhận mật khẩu'),
}).superRefine((data, ctx) => {
    if (data.password !== data.passwordConfirm) {
      ctx.addIssue({
        path: ['passwordConfirm'],
        message: 'Mật khẩu xác nhận không khớp',
        code: z.ZodIssueCode.custom,
      })
    }
  })

export const updateUserProfileSchema = z.object({
  fullname: z
    .string()
    .min(1, 'Họ tên không được để trống'),

  phone: phoneOptionalSchema,

  birthday: z.coerce
    .date({ invalid_type_error: 'Ngày sinh không hợp lệ' })
    .optional()
    .nullable(),

  gender: genderSchema.optional(),

  avatar: z.string().optional().nullable(),
})