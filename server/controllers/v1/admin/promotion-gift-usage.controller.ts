import type { Request, Response } from "express";
import mongoose from "mongoose";
import { PromotionGiftUsageEntity } from "../../../models/v1/promotion-gift-usage.entity";

export const getAllPromotionGiftUsage = async (req: Request, res: Response) => {
  try {
    let {
      page = 1,
      limit = 10,
      userId,
      orderId,
      promotionGiftId,
      reverted,
      fromDate,
      toDate,
    } = req.query;

    const numPage = Number(page);
    const numLimit = Number(limit);
    const skip = (numPage - 1) * numLimit;

    const filter: any = {};

    if (userId) {
      filter.userId = new mongoose.Types.ObjectId(userId as string);
    }

    if (orderId) {
      filter.orderId = new mongoose.Types.ObjectId(orderId as string);
    }

    if (promotionGiftId) {
      filter.promotionGiftId = new mongoose.Types.ObjectId(promotionGiftId as string);
    }

    if (reverted !== undefined) {
      filter.reverted = reverted === "true";
    }

    if (fromDate || toDate) {
      filter.usedAt = {};

      if (fromDate) {
        filter.usedAt.$gte = new Date(fromDate as string);
      }

      if (toDate) {
        const endDate = new Date(toDate as string);
        endDate.setHours(23, 59, 59, 999);
        filter.usedAt.$lte = endDate;
      }
    }

    const [list, total] = await Promise.all([
      PromotionGiftUsageEntity.find(filter)
        .populate("promotionGiftId", "name minOrderValue usageLimit")
        .populate("userId", "fullname phone email")
        .populate("orderId", "code totalPrice")
        .sort({ usedAt: -1 })
        .skip(skip)
        .limit(numLimit),

      PromotionGiftUsageEntity.countDocuments(filter),
    ]);

    return res.json({
      code: 0,
      data: list,
      pagination: {
        page: numPage,
        limit: numLimit,
        total,
        totalPages: Math.ceil(total / numLimit),
      },
    });
  } catch (err: any) {
    console.error("getAllPromotionGiftUsage error:", err);
    return res.status(500).json({
      code: 1,
      message: "Lỗi lấy lịch sử sử dụng promotion gift",
    });
  }
};
