import { z } from 'zod'
import { objectIdSchema } from './common.schema'
import { VOUCHER_TYPE } from '@/shared/constants/voucher-type';

const baseVoucherSchema = z.object({
  code: z
    .string()
    .min(1, "Mã voucher là bắt buộc")
    .max(50, "Mã voucher không vượt quá 50 ký tự"),

  name: z
    .string()
    .min(1, "Tên voucher là bắt buộc")
    .max(100, "Tên voucher không vượt quá 100 ký tự"),

  description: z.string().optional().default(""),

  image: z.preprocess(
    (val) => (val === '' ? undefined : val),
    z.string().url('image không hợp lệ').optional()
  ),

  // type: z.enum(VOUCHER_TYPE_LIST),
  type: z.string(),

  value: z.coerce.number().min(0, "Giá trị giảm không hợp lệ"),

  maxDiscount: z.coerce.number().min(0).optional(),

  minOrderValue: z.coerce.number().min(0, "Đơn hàng tối thiểu không hợp lệ"),

  maxShippingDiscount: z.coerce.number().min(0).optional(),

  usageLimit: z.coerce.number().int().min(0, "Số lượt dùng không hợp lệ"),

  limitPerUser: z.coerce.number().int().min(0, "Giới hạn mỗi user không hợp lệ"),

  startDate: z.coerce.date(),

  endDate: z.coerce.date(),

  applicableProducts: z.array(objectIdSchema).optional().default([]),

  applicableCategories: z.array(objectIdSchema).optional().default([]),

  stackable: z.coerce.boolean().default(false),

  isActive: z.coerce.boolean().default(true),
});

const voucherBusinessValidate = (data: any, ctx: z.RefinementCtx) => {
  if (data.startDate >= data.endDate) {
    ctx.addIssue({
      path: ["endDate"],
      message: "Ngày kết thúc phải sau ngày bắt đầu",
      code: z.ZodIssueCode.custom,
    });
  }

  // Percentage
  if (data.type === VOUCHER_TYPE.percentage.type) {
    if (data.value <= 0 || data.value > 100) {
      ctx.addIssue({
        path: ["value"],
        message: "Phần trăm giảm phải từ 1–100",
        code: z.ZodIssueCode.custom,
      });
    }

    if (data.maxDiscount === undefined) {
      ctx.addIssue({
        path: ["maxDiscount"],
        message: "Giảm theo % phải có giảm tối đa",
        code: z.ZodIssueCode.custom,
      });
    }
  }

  // Fixed
  if (data.type === VOUCHER_TYPE.fixed.type && data.value <= 0) {
    ctx.addIssue({
      path: ["value"],
      message: "Giá trị giảm phải > 0",
      code: z.ZodIssueCode.custom,
    });
  }

  // Freeship
  if (data.type === VOUCHER_TYPE.freeship.type && !data.maxShippingDiscount) {
    ctx.addIssue({
      path: ["maxShippingDiscount"],
      message: "Voucher freeship cần giảm phí vận chuyển tối đa",
      code: z.ZodIssueCode.custom,
    });
  }

  // Product / Category
  if (
    data.type === VOUCHER_TYPE.product.type &&
    (!data.applicableProducts?.length && !data.applicableCategories?.length)
  ) {
    ctx.addIssue({
      path: ["applicableProducts"],
      message: "Voucher sản phẩm phải chọn sản phẩm hoặc danh mục",
      code: z.ZodIssueCode.custom,
    });
  }
};

export const createVoucherSchema = baseVoucherSchema.superRefine(
  voucherBusinessValidate
);

export const updateVoucherSchema = baseVoucherSchema
  .partial()
  .superRefine(voucherBusinessValidate);

export const voucherIdParamSchema = z.object({
  id: objectIdSchema,
});