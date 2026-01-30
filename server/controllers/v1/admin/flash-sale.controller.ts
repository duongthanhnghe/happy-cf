import type { Request, Response } from "express";
import { FlashSaleEntity } from "../../../models/v1/flash-sale.entity";
import { toFlashSaleDTO } from "../../../mappers/v1/flash-sale.mapper";

const makeItemKey = (item: any) =>
  `${item.productId}-${item.variantSku ?? "default"}`;

const findOverlappingFlashSales = async (
  productId: string,
  variantSku: string | null | undefined,
  startDate: Date,
  endDate: Date,
  excludeId?: string
) => {
  return FlashSaleEntity.findOne({
    ...(excludeId && { _id: { $ne: excludeId } }),
    startDate: { $lt: endDate },
    endDate: { $gt: startDate },
    items: {
      $elemMatch: {
        productId,
        ...(variantSku
          ? { variantSku }
          : { $or: [{ variantSku: null }, { variantSku: "" }] }),
      },
    },
  });
};

export const getAllFlashSales = async (req: Request, res: Response) => {
  try {
    let {
      page = 1,
      limit = 10,
      name,
      isActive,
      fromDate,
      toDate,
    } = req.query;

    const numPage = Number(page);
    const numLimit = Number(limit);

    const filter: any = {};

    if (name) {
      filter.name = { $regex: name as string, $options: "i" };
    }

    if (isActive !== undefined) {
      filter.isActive = isActive === "true";
    }

    if (fromDate || toDate) {
      filter.startDate = {};
      if (fromDate) filter.startDate.$gte = new Date(fromDate as string);
      if (toDate) filter.startDate.$lte = new Date(toDate as string);
    }

    const result = await FlashSaleEntity.paginate(filter, {
      page: numPage,
      limit: numLimit,
      sort: { priority: -1, startDate: -1 },
      populate: {
        path: 'items.productId',
        select: 'productName image',
      },
    });

    return res.json({
      code: 0,
      data: result.docs.map(toFlashSaleDTO),
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        total: result.totalDocs,
      },
    });
  } catch (err: any) {
    console.error("getAllFlashSales error:", err);
    return res.status(500).json({
      code: 1,
      message: "Lỗi lấy danh sách flash sale",
      error: err.message,
    });
  }
};

export const getFlashSaleById = async (req: Request, res: Response) => {
  try {
    const flashSale = await FlashSaleEntity.findById(req.params.id);
    if (!flashSale) {
      return res.status(404).json({ code: 1, message: "Flash Sale không tồn tại" });
    }

    return res.json({ code: 0, data: toFlashSaleDTO(flashSale) });
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const createFlashSale = async (req: Request, res: Response) => {
  try {
    const exists = await FlashSaleEntity.findOne({ slug: req.body.slug });
    if (exists) {
      return res.status(400).json({
        code: 1,
        message: "Slug đã tồn tại",
      });
    }

    const { startDate, endDate, items } = req.body;

    for (const item of items) {
      const conflict = await findOverlappingFlashSales(
        item.productId,
        item.variantSku ?? null,
        new Date(startDate),
        new Date(endDate),
      );

      if (conflict) {
        return res.status(400).json({
          code: 1,
          message: `Sản phẩm ${item.productId}${
            item.variantSku ? ` (${item.variantSku})` : ""
          } đang nằm trong Flash Sale "${conflict.name}" trùng thời gian`,
        });
      }
    }

    const flashSale = new FlashSaleEntity(req.body);
    await flashSale.save();

    return res.json({
      code: 0,
      message: "Tạo Flash Sale thành công",
      data: toFlashSaleDTO(flashSale),
    });
  } catch (err: any) {
    return res.status(500).json({
      code: 1,
      message: err.message,
    });
  }
};

export const updateFlashSale = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updateData = { ...req.body };
    const now = new Date();

    const flashSale = await FlashSaleEntity.findById(id);
    if (!flashSale) {
      return res.status(404).json({
        code: 1,
        message: "Flash Sale không tồn tại",
      });
    }

    const isStartedOrEnded = flashSale.startDate <= now;

    let newItemsToAdd: any[] = [];

    if (isStartedOrEnded) {
      delete updateData.startDate;
      delete updateData.endDate;
      delete updateData.stackableWithVoucher;
      delete updateData.stackableWithPromotionGift;

      if (Array.isArray(updateData.items)) {
        const existingKeys = new Set(
          flashSale.items.map(makeItemKey)
        );

        newItemsToAdd = updateData.items.filter(
          (item: any) => !existingKeys.has(makeItemKey(item))
        );

        delete updateData.items;
      }
    }

    for (const item of newItemsToAdd) {
      const conflict = await findOverlappingFlashSales(
        item.productId,
        item.variantSku ?? null,
        flashSale.startDate,
        flashSale.endDate,
        id
      );

      if (conflict) {
        return res.status(400).json({
          code: 1,
          message: `Sản phẩm ${item.productId}${
            item.variantSku ? ` (${item.variantSku})` : ""
          } đang nằm trong Flash Sale "${conflict.name}" trùng thời gian`,
        });
      }
    }

    const updated = await FlashSaleEntity.findByIdAndUpdate(
      id,
      {
        $set: updateData,
        ...(isStartedOrEnded && newItemsToAdd.length > 0 && {
          $push: { items: { $each: newItemsToAdd } },
        }),
      },
      {
        new: true,
        runValidators: true,
      }
    );

    return res.json({
      code: 0,
      message: "Cập nhật Flash Sale thành công",
      data: toFlashSaleDTO(updated!),
    });
  } catch (err: any) {
    return res.status(500).json({
      code: 1,
      message: err.message,
    });
  }
};

export const deleteFlashSale = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const flashSale = await FlashSaleEntity.findById(id);

    if (!flashSale) {
      return res.status(404).json({
        code: 1,
        message: "Flash Sale không tồn tại",
      });
    }

    const now = new Date();
    const startDate = new Date(flashSale.startDate);
    const endDate = new Date(flashSale.endDate);

    // ĐÃ KẾT THÚC → không làm gì
    if (now > endDate) {
      return res.json({
        code: 0,
        message: "Flash Sale đã kết thúc, không thể xoá hoặc thay đổi",
      });
    }

    // ĐANG DIỄN RA → chỉ vô hiệu hoá
    if (now >= startDate && now <= endDate) {
      if (!flashSale.isActive) {
        return res.json({
          code: 0,
          message: "Flash Sale đã bị vô hiệu hoá trước đó",
        });
      }

      flashSale.isActive = false;
      await flashSale.save();

      return res.json({
        code: 0,
        message: "Flash Sale đang diễn ra đã được vô hiệu hoá",
      });
    }

    // CHƯA DIỄN RA → xoá hẳn
    if (now < startDate) {
      await FlashSaleEntity.deleteOne({ _id: id });

      return res.json({
        code: 0,
        message: "Flash Sale chưa diễn ra đã được xoá",
      });
    }
  } catch (err: any) {
    console.error("deleteFlashSale error:", err);
    return res.status(500).json({
      code: 1,
      message: "Lỗi xoá Flash Sale",
      error: err.message,
    });
  }
};

export const toggleActiveFlashSale = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const flashSale = await FlashSaleEntity
      .findById(id)
      .populate({
        path: "items.productId",
        select: "productName image",
      });

    if (!flashSale) {
      return res.status(404).json({
        code: 1,
        message: "Flash Sale không tồn tại",
      });
    }

    const now = new Date();

    // Flash Sale đã kết thúc thì không bật lại
    if (flashSale.endDate < now) {
      return res.status(400).json({
        code: 1,
        message: "Flash Sale đã kết thúc, không thể thay đổi trạng thái",
      });
    }

    flashSale.isActive = !flashSale.isActive;
    await flashSale.save();

    return res.json({
      code: 0,
      message: "Cập nhật trạng thái Flash Sale thành công",
      data: toFlashSaleDTO(flashSale),
    });
  } catch (err: any) {
    return res.status(500).json({
      code: 1,
      message: err.message || "Lỗi khi cập nhật trạng thái Flash Sale",
    });
  }
};