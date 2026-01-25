import type { Request, Response } from "express";
import { PromotionGiftEntity } from "../../models/v1/promotion-gift.entity";
import {
  toAvailablePromotionGiftDTO,
} from "../../mappers/v1/promotion-gift.mapper";
import type { AvailablePromotionGiftDTO } from "@/server/types/dto/v1/promotion-gift.dto";

export const getAvailablePromotionGifts = async (req: Request, res: Response) => {
  try {
    const {
      productIds = [],
      categoryIds = [],
      orderTotal = 0,
    } = req.body

    const now = new Date()

    const andConditions: any[] = []

    // usageLimit
    andConditions.push({
      $or: [
        { usageLimit: 0 },
        { usageLimit: { $exists: false } },
        {
          $expr: {
            $lt: ['$usedCount', '$usageLimit']
          }
        }
      ]
    })

    // product / category
    const orProductCategory: any[] = []
    if (productIds.length > 0) {
      orProductCategory.push({
        requiredProducts: { $in: productIds },
      })
    }
    if (categoryIds.length > 0) {
      orProductCategory.push({
        requiredCategories: { $in: categoryIds },
      })
    }

    if (orProductCategory.length === 0) {
      return res.json({ code: 0, data: [] })
    }

    andConditions.push({ $or: orProductCategory })

    const filter = {
      isActive: true,
      startDate: { $lte: now },
      endDate: { $gte: now },
      $and: andConditions,
    }

    const items = await PromotionGiftEntity
      .find(filter)
      .populate({
        path: 'gifts.productId',
      })
      .sort({ createdAt: -1 })

    const result: AvailablePromotionGiftDTO[] = items.map(promo => {
      const minOrderValue = promo.minOrderValue || 0
      const missingAmount = Math.max(minOrderValue - orderTotal, 0)

      if (orderTotal >= minOrderValue) {
        return {
          ...toAvailablePromotionGiftDTO(promo),
          locked: false,
          message: '',
          missingAmount: 0,
        }
      }

      return {
        ...toAvailablePromotionGiftDTO(promo),
        locked: true,
        missingAmount,
        message: `Mua thêm ${missingAmount.toLocaleString()}đ để nhận quà`,
      }
    })

    return res.json({
      code: 0,
      data: result,
    })
  } catch (err: any) {
    return res.status(500).json({
      code: 1,
      message: "Lỗi lấy danh sách quà tặng khả dụng",
      error: err.message,
    })
  }
}
