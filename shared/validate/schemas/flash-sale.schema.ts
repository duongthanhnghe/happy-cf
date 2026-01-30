import { z } from "zod";
import { objectIdSchema } from "./common.schema";

const flashSaleBannerSchema = z.object({
  id: z.string().min(1, "Banner id là bắt buộc"),
  src: z.string().url("Banner src không hợp lệ"),
});

const flashSaleThemeSchema = z.object({
  primaryColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  textColor: z.string().optional(),
});

const flashSaleItemSchema = z.object({
  productId: objectIdSchema,

  variantSku: z
    .string()
    .min(1, "SKU không hợp lệ")
    .nullable()
    .optional(),

  originalPrice: z.coerce
    .number()
    .min(0, "Giá gốc không hợp lệ"),

  salePrice: z.coerce
    .number()
    .min(0, "Giá flash sale không hợp lệ"),

  quantity: z.coerce
    .number()
    .int()
    .min(1, "Số lượng phải >= 1"),

  sold: z.coerce
    .number()
    .int()
    .min(0, "Số lượng đã bán không hợp lệ")
    .default(0),
});

const baseFlashSaleSchema = z.object({
  name: z
    .string()
    .min(1, "Tên Flash Sale là bắt buộc")
    .max(150, "Tên Flash Sale không vượt quá 150 ký tự"),

  slug: z
    .string()
    .min(1, "Slug là bắt buộc")
    .regex(/^[a-z0-9-]+$/, "Slug chỉ gồm chữ thường, số và dấu -"),

  description: z.string().optional().default(""),

  startDate: z.coerce.date(),
  endDate: z.coerce.date(),

  isActive: z.coerce.boolean().default(true),

  priority: z.coerce
    .number()
    .int()
    .min(0, "Priority không hợp lệ")
    .default(0),

  banners: z.array(flashSaleBannerSchema).default([]),

  theme: flashSaleThemeSchema.optional(),

  titleSEO: z.string().max(255).optional(),
  descriptionSEO: z.string().max(500).optional(),

  badgeImage: z.preprocess(
    (val) => (val === "" ? undefined : val),
    z.string().url("Badge image không hợp lệ").optional()
  ),

  items: z
    .array(flashSaleItemSchema)
    .min(1, "Flash Sale phải có ít nhất 1 sản phẩm"),

  stackableWithVoucher: z.coerce.boolean().default(false),
  stackableWithPromotionGift: z.coerce.boolean().default(false),
});

const flashSaleBusinessValidate = (data: any, ctx: z.RefinementCtx) => {
  if (data.startDate >= data.endDate) {
    ctx.addIssue({
      path: ["endDate"],
      message: "Thời gian kết thúc phải sau thời gian bắt đầu",
      code: z.ZodIssueCode.custom,
    });
  }

  data.items.forEach((item: any, index: number) => {
    if (item.salePrice >= item.originalPrice) {
      ctx.addIssue({
        path: ["items", index, "salePrice"],
        message: "Giá Flash Sale phải nhỏ hơn giá gốc",
        code: z.ZodIssueCode.custom,
      });
    }

    if (item.sold > item.quantity) {
      ctx.addIssue({
        path: ["items", index, "sold"],
        message: "Số lượng đã bán không được vượt quá số lượng",
        code: z.ZodIssueCode.custom,
      });
    }

    if (item.hasVariant === true && !item.variantSku) {
      ctx.addIssue({
        path: ["items", index, "variantSku"],
        message: "Sản phẩm có biến thể thì phải chọn biến thể",
        code: z.ZodIssueCode.custom,
      });
    }
  });

  const seen = new Set<string>();
  data.items.forEach((item: any, index: number) => {
    const key = `${item.productId}-${item.variantSku || "default"}`;
    if (seen.has(key)) {
      ctx.addIssue({
        path: ["items", index],
        message: "Sản phẩm / biến thể bị trùng trong Flash Sale",
        code: z.ZodIssueCode.custom,
      });
    }
    seen.add(key);
  });
};

export const createFlashSaleSchema =
  baseFlashSaleSchema.superRefine(flashSaleBusinessValidate);

export const updateFlashSaleSchema =
  baseFlashSaleSchema
    .partial()
    .superRefine(flashSaleBusinessValidate);

export const flashSaleIdParamSchema = z.object({
  id: objectIdSchema,
});