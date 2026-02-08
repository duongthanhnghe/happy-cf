import { z } from 'zod'
import { objectIdSchema } from './common.schema'

export const cartItemSchema = z.object({
  idProduct: objectIdSchema,
  price: z.number().min(0, 'Tổng giá sản phẩm không hợp lệ'),
  originalPrice: z.number().min(0, 'Giá niêm yết của sản phẩm không hợp lệ'),
  priceDiscount: z.number().min(0, 'Giá giảm của sản phẩm không hợp lệ'),
  salePrice: z.number().min(0, 'Giá giảm flash sale của sản phẩm không hợp lệ'),
  quantity: z.number().int().min(1, 'Số lượng phải >= 1'),
  note: z.string().optional().nullable(),
  sku: z.string().optional(),
  combinationId: z.string().optional(),
  variantCombination: z.any().optional().nullable(),
  flashSaleId: z.string().optional().nullable(),
  isFlashSale: z.boolean().optional().nullable(),
  stackableWithPromotionGift: z.boolean().optional().nullable(),
  stackableWithVoucher: z.boolean().optional().nullable(),
})

export const voucherUsageSchema = z.object({
  // voucherId: objectIdSchema,
  code: z.string(),
  type: z.string(),          // order | product | freeship
  discount: z.number().min(0),
}).passthrough()

export const giftItemSchema = z.object({
  promotionGiftId: objectIdSchema,
  productId: objectIdSchema,
  quantity: z.number().int().min(1),
  combinationId: objectIdSchema.optional().nullable(),
})

export const shippingConfigSchema = z.object({
  enabled: z.boolean(),
  minOrderAmount: z.number().min(0),
}).strict()

export const createOrderDataSchema = z.object({
  code: z.string().min(1),
  time: z.string().min(1),
  address: z.string().min(1, 'Địa chỉ là bắt buộc'),
  fullname: z.string().min(1, 'Họ tên là bắt buộc'),
  phone: z.string().min(8, 'Số điện thoại không hợp lệ'),
  note: z.string().optional().nullable(),
  paymentId: objectIdSchema.refine(Boolean, {
    message: 'Phương thức thanh toán không hợp lệ',
  }),
  cartItems: z.array(cartItemSchema).min(1, 'Giỏ hàng trống'),
  giftItems: z.array(giftItemSchema).optional().default([]),
  // totalPrice: z.number().min(0),
  // totalPriceSave: z.number().min(0),
  // totalPriceCurrent: z.number().min(0),
  // totalDiscountOrder: z.number().min(0),
  shippingFee: z.number().min(0),
  provinceCode: z.number(),
  districtCode: z.number(),
  wardCode: z.number(),
  provinceName: z.string(),
  districtName: z.string(),
  wardName: z.string(),
  voucherUsage: z.array(voucherUsageSchema).optional().default([]),
})

export const createOrderSchema = z.object({
  data: createOrderDataSchema,

  usedPoint: z.number().optional().default(0),
})

export const orderIdParamSchema = z.object({ id: objectIdSchema, })

export const updateOrderStatusSchema = z.object({
  orderId: objectIdSchema,
  statusId: objectIdSchema,
})