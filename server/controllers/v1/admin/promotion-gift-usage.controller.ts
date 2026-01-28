import type { Request, Response } from "express";
import mongoose from "mongoose";
import { PromotionGiftUsageEntity } from "../../../models/v1/promotion-gift-usage.entity";

export const getAllPromotionGiftUsage = async (req: Request, res: Response) => {
  try {
    let {
      page = 1,
      limit = 10,
      search,
      reverted,
      fromDate,
      toDate,
    } = req.query;

    const numPage = Number(page);
    const numLimit = Number(limit);
    const skip = (numPage - 1) * numLimit;

    const filter: any = {};

    if (search && mongoose.Types.ObjectId.isValid(search as string)) {
      const objectId = new mongoose.Types.ObjectId(search as string);

      filter.$or = [
        { promotionGiftId: objectId },
        { orderId: objectId },
        { userId: objectId },
      ];
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
