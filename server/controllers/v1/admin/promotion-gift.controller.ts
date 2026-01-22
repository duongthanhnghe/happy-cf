import type { Request, Response } from "express";
import { PromotionGiftEntity } from "../../../models/v1/promotion-gift.entity";
import {
  toPromotionGiftDTO,
  toPromotionGiftListDTO,
} from "../../../mappers/v1/promotion-gift.mapper";

export const getAllPromotionGifts = async (req: Request, res: Response) => {
  try {
    let {
      page = 1,
      limit = 10,
      name,
      fromDate,
      toDate,
    } = req.query

    const numPage = Number(page)
    const numLimit = Number(limit)

    const filter: any = {}

    if (name) {
      filter.name = { $regex: name as string, $options: 'i' }
    }

    if (fromDate || toDate) {
      if (fromDate) {
        filter.startDate = { $gte: new Date(fromDate as string) }
      }

      if (toDate) {
        filter.endDate = { $lte: new Date(toDate as string) }
      }
    }

    if (numLimit === -1) {
      const items = await PromotionGiftEntity
        .find(filter)
        .sort({ createdAt: -1 })

      return res.json({
        code: 0,
        data: items.map(toPromotionGiftDTO),
        pagination: {
          page: 1,
          limit: items.length,
          totalPages: 1,
          total: items.length,
        },
      })
    }

    const result = await PromotionGiftEntity.paginate(filter, {
      page: numPage,
      limit: numLimit,
      sort: { createdAt: -1 },
      populate: {
        path: 'gifts.productId',
        select: 'productName image',
      },
    })

    return res.json({
      code: 0,
      data: result.docs.map(toPromotionGiftDTO),
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        total: result.totalDocs,
      },
    })
  } catch (err: any) {
    return res.status(500).json({
      code: 1,
      message: 'Lỗi lấy danh sách CTKM tặng quà',
      error: err.message,
    })
  }
}

export const getPromotionGiftById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const item = await PromotionGiftEntity.findById(id);

    if (!item) {
      return res
        .status(404)
        .json({ code: 1, message: "Promotion gift không tồn tại" });
    }

    return res.json({ code: 0, data: toPromotionGiftDTO(item) });
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const createPromotionGift = async (req: Request, res: Response) => {
  try {
    const newItem = new PromotionGiftEntity({
      ...req.body,
      usedCount: 0,
    });

    await newItem.save();

    return res.status(201).json({
      code: 0,
      message: "Tạo promotion gift thành công",
      data: toPromotionGiftDTO(newItem),
    });
  } catch (err: any) {
    return res.status(400).json({ code: 1, message: err.message });
  }
};


export const updatePromotionGift = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const updated = await PromotionGiftEntity.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!updated) {
      return res
        .status(404)
        .json({ code: 1, message: "Promotion gift không tồn tại" });
    }

    return res.json({
      code: 0,
      message: "Cập nhật promotion gift thành công",
      data: toPromotionGiftDTO(updated),
    });
  } catch (err: any) {
    return res.status(400).json({ code: 1, message: err.message });
  }
};


export const deletePromotionGift = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const deleted = await PromotionGiftEntity.findByIdAndDelete(id);

    if (!deleted) {
      return res
        .status(404)
        .json({ code: 1, message: "Promotion gift không tồn tại" });
    }

    return res.json({
      code: 0,
      message: "Xoá promotion gift thành công",
    });
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};
