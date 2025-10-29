import type { Request, Response } from "express";
import mongoose from "mongoose";
import { VoucherUsageEntity } from "../../../models/v1/VoucherUsageEntity";

export const getAllVoucherUsage = async (req: Request, res: Response) => {
  try {
    let { page = 1, limit = 10, userId, code, orderId, reverted } = req.query;

    const numPage = Number(page);
    const numLimit = Number(limit);

    // 🎯 Bộ lọc động
    const filter: any = {};

    if (userId) filter.userId = new mongoose.Types.ObjectId(userId as string);
    if (code) filter.code = code;
    if (orderId) filter.orderId = new mongoose.Types.ObjectId(orderId as string);
    if (reverted !== undefined) filter.reverted = reverted === "true";

    const skip = (numPage - 1) * numLimit;

    const [list, total] = await Promise.all([
      VoucherUsageEntity.find(filter)
        .populate("voucherId", "code name type value")
        .populate("userId", "fullname phone")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(numLimit),

      VoucherUsageEntity.countDocuments(filter),
    ]);

    return res.json({
      code: 0,
      data: list,
      pagination: {
        page: numPage,
        limit: numLimit,
        totalPages: Math.ceil(total / numLimit),
        total,
      },
    });
  } catch (err: any) {
    console.error("❌ Lỗi getAllVoucherUsage:", err);
    return res
      .status(500)
      .json({ code: 1, message: "Lỗi lấy danh sách VoucherUsage", error: err.message });
  }
};
