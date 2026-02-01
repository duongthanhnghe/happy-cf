import type { Request, Response } from "express"
import { VoucherEntity } from "../../models/v1/voucher.entity"
import { VoucherUsageEntity } from "../../models/v1/voucher-usage.entity"
import { toVoucherListDTO } from "../../mappers/v1/voucher.mapper";

export const applyVoucher = async (req: Request, res: Response) => {
  try {
    const {
      code,
      orderTotal,
      products = [],
      orderCreatedAt,
      userId,
    } = req.body;

    if (!code || !orderTotal)
      return res.status(400).json({ code: 1, message: "Thiếu mã voucher hoặc giá trị đơn hàng" });

    if (!userId)
      return res.status(400).json({ code: 1, message: "Thiếu thông tin người dùng" });

    const voucher = await VoucherEntity.findOne({ code, isActive: true });
    if (!voucher)
      return res.status(404).json({ code: 1, message: "Voucher không tồn tại hoặc không hoạt động" });

    const now = new Date();

    // 1️⃣ Kiểm tra hiệu lực thời gian
    if (voucher.startDate > now)
      return res.status(400).json({ code: 1, message: "Chưa đến thời gian áp dụng voucher" });
    if (voucher.endDate < now)
      return res.status(400).json({ code: 1, message: "Voucher đã hết hạn" });

    // 2️⃣ Kiểm tra lượt sử dụng
    if (voucher.usageLimit > 0 && voucher.usedCount >= voucher.usageLimit)
      return res.status(400).json({ code: 1, message: "Voucher đã hết lượt sử dụng" });

    const userUsedCount = await VoucherUsageEntity.countDocuments({
      voucherId: voucher._id,
      userId,
    });
    if (voucher.limitPerUser > 0 && userUsedCount >= voucher.limitPerUser)
      return res.status(400).json({ code: 1, message: "Bạn đã dùng hết lượt của voucher này" });

    // 3️⃣ Kiểm tra giá trị đơn tối thiểu
    if (voucher.minOrderValue && orderTotal < voucher.minOrderValue)
      return res.status(400).json({
        code: 1,
        message: `Đơn hàng chưa đạt giá trị tối thiểu ${voucher.minOrderValue.toLocaleString()}đ`,
      });

    // 4️⃣ Lọc sản phẩm hợp lệ theo danh mục hoặc danh sách sản phẩm
    let applicableProducts: any[] = [];

    if (voucher.type === "product") {
      if(voucher.value < 0 || voucher.value > 100) {
        return res.status(400).json({ code: 1, message: "Giá trị giảm (%) không hợp lệ" });
      }

      const applicableProductIds = (voucher.applicableProducts ?? []).map(String);
      const applicableCategoryIds = (voucher.applicableCategories ?? []).map(String);

      applicableProducts = products.filter((p: any) => {
        const pid = p.productId?.toString();
        const cid = p.categoryId?.toString();
        return (
          applicableProductIds.includes(pid) ||
          applicableCategoryIds.includes(cid)
        );
      });

      if (applicableProducts.length === 0) {
        return res.status(400).json({
          code: 1,
          message: "Voucher không áp dụng cho sản phẩm nào trong đơn hàng",
        });
      }
    } else {
      // Nếu không phải voucher sản phẩm, áp dụng toàn bộ đơn
      applicableProducts = products;
    }

    // 5️⃣ Tính giảm giá
    const subtotalApplicable = applicableProducts.reduce(
      (sum, p) => sum + p.price * p.quantity,
      0
    );

    let discount = 0;
    let message = "Áp dụng voucher thành công";

    switch (voucher.type) {
      case "percentage":
        discount = Math.min(
          (subtotalApplicable * voucher.value) / 100,
          voucher.maxDiscount || Infinity
        );
        break;

      case "fixed":
        discount = Math.min(voucher.value, subtotalApplicable);
        break;

      case "freeship":
        if (!voucher.maxShippingDiscount)
          return res.status(400).json({
            code: 1,
            message: "Voucher freeship chưa cấu hình mức giảm phí tối đa",
          });
        discount = Math.min(voucher.maxShippingDiscount, orderTotal);
        message = `Áp dụng miễn phí vận chuyển (tối đa ${voucher.maxShippingDiscount.toLocaleString()}đ)`;
        break;

      case "product":
        discount = Math.min(
          (subtotalApplicable * voucher.value) / 100,
          voucher.maxDiscount || Infinity
        );

        const productNames = applicableProducts.map((p: any) => p.name);
        if (productNames.length === 1) {
          message = `Mã giảm giá <b>${voucher.code}</b> áp dụng giảm ${voucher.value}% cho sản phẩm: ${productNames[0]}`;
        } else {
          message = `Mã giảm giá <b>${voucher.code}</b> áp dụng giảm ${voucher.value}% cho ${productNames.length} sản phẩm: ${productNames
          .map(name => `<div>- ${name}</div>`)
          .join("")}`;
        }

        break;

      case "timed":
        if (!orderCreatedAt)
          return res.status(400).json({ code: 1, message: "Thiếu thời gian tạo đơn hàng" });
        const createdAt = new Date(orderCreatedAt);
        if (createdAt < voucher.startDate || createdAt > voucher.endDate)
          return res.status(400).json({ code: 1, message: "Voucher không hợp lệ ở thời điểm này" });
        discount = Math.min(
          (subtotalApplicable * voucher.value) / 100,
          voucher.maxDiscount || Infinity
        );
        message = "Áp dụng voucher khung thời gian";
        break;

      default:
        return res.status(400).json({ code: 1, message: "Loại voucher không hợp lệ" });
    }

    // Làm tròn 2 chữ số
    discount = Math.round(discount * 1000) / 1000;

    // ✅ Trả kết quả
    return res.json({
      code: 0,
      message,
      data: {
        code: voucher.code,
        type: voucher.type,
        discount,
        applicableProducts,
        stackable: voucher.stackable,
        expiresAt: voucher.endDate,
      },
    });
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const getAvailableVouchers = async (req: Request, res: Response) => {
  try {
    const { orderTotal = 0, categoryIds = [], userId } = req.body
    const now = new Date()

    // 📍 Lọc voucher hợp lệ theo thời gian & trạng thái
    const vouchers = await VoucherEntity.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
    }).sort({ createdAt: -1 })

    const result = []

    for (const v of vouchers) {
      // ✅ Đếm số lần user đã dùng voucher này
      const userUsedCount = userId
        ? await VoucherUsageEntity.countDocuments({
            voucherId: v._id,
            userId,
          })
        : 0

      let isDisabled = false
      let disabledReason: string | null = null

      // 🔹 1. Hết lượt tổng
      if (v.usageLimit > 0 && v.usedCount >= v.usageLimit) {
        isDisabled = true
        disabledReason = "Voucher đã hết lượt sử dụng"
      }

      // 🔹 2. Hết lượt với người dùng
      else if (v.limitPerUser > 0 && userUsedCount >= v.limitPerUser) {
        isDisabled = true
        disabledReason = "Bạn đã sử dụng hết số lượt của voucher này"
      }

      // 🔹 3. Đơn hàng chưa đạt giá trị tối thiểu
      else if (orderTotal < (v.minOrderValue || 0)) {
        isDisabled = true
        disabledReason = `Đơn hàng chưa đạt giá trị tối thiểu ${v.minOrderValue?.toLocaleString()}đ`
      }

      // 🔹 4. Không áp dụng cho sản phẩm trong đơn hàng
      else if (v.type === "product") {
        const hasApplicableCategories =
          Array.isArray(v.applicableCategories) &&
          Array.isArray(categoryIds) &&
          categoryIds.some((cid: string) =>
            (v.applicableCategories ?? []).map(String).includes(cid.toString())
          )

        if (!hasApplicableCategories) {
          isDisabled = true
          disabledReason = "Không áp dụng cho sản phẩm hoặc danh mục trong đơn hàng"
        }
      }

      result.push({
        ...v.toObject(),
        isDisabled,
        disabledReason,
      })
    }

    return res.json({
      code: 0,
      message: "Lấy danh sách voucher thành công",
      data: result,
    })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const getAllVouchers = async (req: Request, res: Response) => {
  try {
    const now = new Date()

    const vouchers = await VoucherEntity.find({
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      $expr: {
        $or: [
          { $eq: ["$usageLimit", 0] },               
          { $lt: ["$usedCount", "$usageLimit"] },   
        ],
      },
    }).sort({ createdAt: -1 })

    return res.json({
      code: 0,
      message: "Lấy danh sách voucher thành công",
      data: toVoucherListDTO(vouchers),
    })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

// export const getApplicableVouchersForProduct = async (product: any) => {
//   const now = new Date();

//   const vouchers = await VoucherEntity.find({
//     isActive: true,
//     startDate: { $lte: now },
//     endDate: { $gte: now },
//     type: { $in: ["product", "percentage", "fixed"] }
//   }).sort({ createdAt: -1 });

//   const categoryId = product.categoryId?.toString();
//   const productPrice = product.priceDiscounts ?? 0;

//   const PRIORITY: any = {
//     product: 1,
//     percentage: 2,
//     fixed: 3
//   };

//   const sorted = vouchers.sort((a, b) => {
//     return PRIORITY[a.type] - PRIORITY[b.type];
//   });

//   for (const v of sorted) {
//     const minOrderValue = v.minOrderValue ?? 0;

//     if (["product"].includes(v.type)) {
//       const applicableCategories = (v.applicableCategories ?? []).map(String);
//       if (applicableCategories.length > 0) {
//         if (!categoryId || !applicableCategories.includes(categoryId)) continue;

//         if (productPrice < minOrderValue) continue;
//       }
//     } else {
//       if (["percentage", "fixed"].includes(v.type)) {
//         if (productPrice < minOrderValue) continue;
//       }
//     }

//     if (!v.image || v.image.trim() === "") continue;

//     return {
//       image: v.image,
//     };
//   }

//   return null;
// };

const pickVoucherForProduct = (
  vouchers: any[],
  product: any
) => {
  const categoryId = product.categoryId?.toString()
  const productPrice = product.priceDiscounts ?? 0

  const PRIORITY: Record<string, number> = {
    product: 1,
    percentage: 2,
    fixed: 3
  }

  const sorted = [...vouchers].sort(
    (a, b) => PRIORITY[a.type] - PRIORITY[b.type]
  )

  for (const v of sorted) {
    const minOrderValue = v.minOrderValue ?? 0

    if (v.type === "product") {
      const applicableCategories =
        (v.applicableCategories ?? []).map(String)

      if (
        applicableCategories.length > 0 &&
        (!categoryId || !applicableCategories.includes(categoryId))
      ) continue

      if (productPrice < minOrderValue) continue
    }

    if (["percentage", "fixed"].includes(v.type)) {
      if (productPrice < minOrderValue) continue
    }

    if (!v.image || v.image.trim() === "") continue

    return { image: v.image }
  }

  return null
}

export const getApplicableVouchersForProducts = async (
  products: any[]
) => {
  if (!products.length) return new Map<string, any>()

  const now = new Date()

  const vouchers = await VoucherEntity.find({
    isActive: true,
    startDate: { $lte: now },
    endDate: { $gte: now },
    type: { $in: ["product", "percentage", "fixed"] }
  })
    .sort({ createdAt: -1 })
    .lean()

  const voucherMap = new Map<string, any>()

  for (const product of products) {
    const voucher = pickVoucherForProduct(vouchers, product)
    voucherMap.set(product._id.toString(), voucher)
  }

  return voucherMap
}
