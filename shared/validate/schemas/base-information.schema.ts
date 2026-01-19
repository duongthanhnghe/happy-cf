import { z } from 'zod'
import { phoneSchema, emailSchema } from './common.schema'

export const rewardConfigSchema = z.object({
  enableEarnPoint: z.boolean().default(true),
  enableUsePoint: z.boolean().default(true),

  rateUsePoint: z.preprocess(
    v => (v === '' || v === null ? 0 : Number(v)),
    z.number().min(0).default(0)
  ),
})

export const shippingConfigSchema = z.object({
  enabled: z.boolean().default(false),
  minOrderAmount: z.preprocess(
    v => (v === '' || v === null ? 0 : Number(v)),
    z.number().min(0).default(0)
  ),
})

export const systemConfigSchema = z.object({
  reward: rewardConfigSchema,
  shipping: shippingConfigSchema,
})

export const updateSystemConfigSchema = z.object({
  reward: rewardConfigSchema.partial().optional(),
  shipping: shippingConfigSchema.partial().optional(),
})

export const socialLinkSchema = z.object({
  name: z.string().min(1),
  icon: z.string().min(1),
  src: z
    .preprocess(
      v => (v === null || v === undefined ? '' : String(v)),
      z.string().url('Link mạng xã hội không hợp lệ').optional()
    )
    .optional(),
})

export const baseInformationSchema = z.object({
  name: z.string().min(1, 'Tên công ty là bắt buộc'),

  logoUrl: z
  .string()
  .min(1, 'Logo là bắt buộc')
  .refine(
    (val) =>
      val.startsWith('/') ||
      /^https?:\/\/.+/.test(val),
    {
      message: 'Logo không hợp lệ',
    }
  ),

  phone: phoneSchema,

  email: emailSchema,

  address: z.string().min(1, 'Địa chỉ là bắt buộc'),

  openingHours: z.string().optional().default(''),

  description: z.string().optional().default(''),

  socialLinks: z.array(socialLinkSchema).optional().default([]),

  provinceCode: z.preprocess(
    v => (v === '' || v === null ? undefined : Number(v)),
    z.number().optional()
  ),

  districtCode: z.preprocess(
    v => (v === '' || v === null ? undefined : Number(v)),
    z.number().optional()
  ),

  wardCode: z.preprocess(
    v => (v === '' || v === null ? undefined : Number(v)),
    z.number().optional()
  ),

  systemConfig: systemConfigSchema
    .optional()
    .default({
      reward: {
        enableEarnPoint: true,
        enableUsePoint: true,
        rateUsePoint: 0,
      },
      shipping: {
        enabled: false,
        minOrderAmount: 0,
      },
    }),
})

export const updateBaseInformationSchema = z.object({
  name: z.string().min(1).optional(),
  logoUrl: z.string().optional(),
  phone: phoneSchema.optional(),
  email: emailSchema.optional(),
  address: z.string().optional(),
  openingHours: z.string().optional(),
  description: z.string().optional(),
  socialLinks: z.array(socialLinkSchema).optional(),

  provinceCode: z.number().optional(),
  districtCode: z.number().optional(),
  wardCode: z.number().optional(),

  systemConfig: updateSystemConfigSchema.optional()
})
