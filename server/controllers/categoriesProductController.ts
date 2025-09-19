import { Types } from "mongoose";
import type { Request, Response } from "express";
import { CategoryProductEntity, ProductEntity } from "../models/ProductEntity";
import type { CreateCategoryProductBody, UpdateCategoryProductBody } from "@/server/types/dto/product.dto";
import {
  toProductDTO,
  toProductListDTO,
  toCategoryProductDTO,
  toCategoryProductListDTO,
} from "../mappers/productMapper"

export const getAllCategories = async (_: Request, res: Response) => {
  try {
    const categories = await CategoryProductEntity.find().lean().sort({ order: 1 })
    return res.json({ code: 0, data: toCategoryProductListDTO(categories) })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const getCategoriesById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ code: 1, message: "ID không hợp lệ" });
    }

    const category = await CategoryProductEntity.findById(req.params.id).lean();
    if (!category) {
      return res.status(404).json({ code: 1, message: "Danh mục không tồn tại" });
    }
   
    return res.json({ code: 0, data: toCategoryProductDTO(category) })
    
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const getCategoriesBySlug = async (
  req: Request<{ slug: string }>,
  res: Response
) => {
  try {
    const { slug } = req.params;

    const category = await CategoryProductEntity.findOne({ slug }).lean();
    if (!category) {
      return res.status(404).json({ code: 1, message: "Danh mục không tồn tại" });
    }

    return res.json({
      code: 0,
      data: toCategoryProductDTO(category),
      message: "Success",
    });
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const createCategories = async (req: Request<{}, {}, CreateCategoryProductBody>, res: Response) => {
  try {
    const { categoryName, image } = req.body;
    if (!categoryName || !image) {
      return res.status(400).json({ code: 1, message: "Thiếu categoryName hoặc image" });
    }

    const existed = await CategoryProductEntity.findOne({ categoryName });
    if (existed) {
      return res.status(400).json({ code: 1, message: "Danh mục đã tồn tại" });
    }

    const lastItem = await CategoryProductEntity.findOne().sort({ order: -1 })
    const maxOrder = lastItem ? lastItem.order : 0

    const newItem = new CategoryProductEntity({
      ...req.body,
      order: maxOrder + 1,
    })
    await newItem.save()

    // const newCategory = new CategoryProductEntity({ categoryName, description, image });

    return res.status(201).json({ code: 0, message: "Tạo thành công", data: toCategoryProductDTO(newItem) });
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const updateCategories = async (req: Request<{ id: string }, {}, Partial<UpdateCategoryProductBody>>, res: Response) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ code: 1, message: "ID không hợp lệ" });
    }

    const updatedCategory = await CategoryProductEntity.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).lean();

    if (!updatedCategory) {
      return res.status(404).json({ code: 1, message: "Danh mục không tồn tại" });
    }

    return res.json({ code: 0, message: "Cập nhật thành công", data: toCategoryProductDTO(updatedCategory) });
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const deleteCategories = async (req: Request<{ id: string }>, res: Response) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ code: 1, message: "ID không hợp lệ" });
    }

    const categoryId = new Types.ObjectId(req.params.id);

    const hasProducts = await ProductEntity.exists({ categoryId });
    if (hasProducts) {
      return res.json({
        code: 1,
        message: "Không thể xóa danh mục vì vẫn còn sản phẩm trong danh mục này"
      });
    }

    const deletedCategory = await CategoryProductEntity.findByIdAndDelete(categoryId);
    if (!deletedCategory) {
      return res.status(404).json({ code: 1, message: "Danh mục không tồn tại" });
    }

    return res.json({ code: 0, message: "Xoá thành công" });
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

// export const getProductsByCategory = async (
//   req: Request<{ id: string }>,
//   res: Response
// ) => {
//   try {
//     if (!Types.ObjectId.isValid(req.params.id)) {
//       return res.status(400).json({ code: 1, message: "ID không hợp lệ" });
//     }

//     const categoryId = new Types.ObjectId(req.params.id);

//     const page = parseInt(req.query.page as string, 10) || 1;
//     let limit = parseInt(req.query.limit as string, 10) || 10;

//     if (limit === -1) {
//       limit = await ProductEntity.countDocuments({ categoryId, isActive: true });
//     }

//     const skip = (page - 1) * limit;

//     const [total, products] = await Promise.all([
//       ProductEntity.countDocuments({ categoryId, isActive: true }),
//       ProductEntity.find({ categoryId, isActive: true })
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(limit)
//         .lean(),
//     ]);

//     const totalPages = Math.ceil(total / limit);

//     return res.json({
//       code: 0,
//       data: toProductListDTO(products),
//       pagination: { page, limit, total, totalPages },
//       message: "Success",
//     });
//   } catch (err: any) {
//     return res.status(500).json({ code: 1, message: err.message });
//   }
// };
export const getProductsByCategory = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ code: 1, message: "ID không hợp lệ" });
    }

    const categoryId = new Types.ObjectId(req.params.id);

    const page = parseInt(req.query.page as string, 10) || 1;
    let limit = parseInt(req.query.limit as string, 10) || 10;
    const sortType = (req.query.sort as string) || "default";

    if (limit === -1) {
      limit = await ProductEntity.countDocuments({ categoryId, isActive: true });
    }

    const skip = (page - 1) * limit;

    const [total, products] = await Promise.all([
      ProductEntity.countDocuments({ categoryId, isActive: true }),
      ProductEntity.aggregate([
        { $match: { categoryId, isActive: true } },

        // Ép kiểu price & priceDiscount sang số
        {
          $addFields: {
            price: { $toDouble: "$price" },
            priceDiscount: { $toDouble: "$priceDiscount" },
          },
        },

        // Tính toán giảm giá
        {
          $addFields: {
            hasDiscount: { $cond: [{ $lt: ["$priceDiscount", "$price"] }, 1, 0] },
            discountValue: {
              $cond: [
                { $lt: ["$priceDiscount", "$price"] },
                { $subtract: ["$price", "$priceDiscount"] },
                0,
              ],
            },
            discountPercent: {
              $cond: [
                { $lt: ["$priceDiscount", "$price"] },
                {
                  $multiply: [
                    { $divide: [{ $subtract: ["$price", "$priceDiscount"] }, "$price"] },
                    100,
                  ],
                },
                0,
              ],
            },
          },
        },

        // Sort động theo sortType
        {
          $sort:
            sortType === "discount"
              ? { hasDiscount: -1, discountPercent: -1, updatedAt: -1 }
              : sortType === "popular"
              ? { amountOrder: -1 }
              : sortType === "price_desc"
              ? { price: -1 }
              : sortType === "price_asc"
              ? { price: 1 }
              : { updatedAt: -1 },
        },

        { $skip: skip },
        { $limit: limit },
      ]),
    ]);

    const totalPages = Math.ceil(total / limit);

    return res.json({
      code: 0,
      data: toProductListDTO(products),
      pagination: { page, limit, total, totalPages },
      message: "Success",
    });
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};


export const updateOrder = async (req: Request, res: Response) => {
  try {
    const { id } = req.params
    const { order } = req.body

    const currentItem = await CategoryProductEntity.findById(id)
    if (!currentItem) {
      return res.status(404).json({ code: 1, message: "Item không tồn tại" })
    }

    const existingItem = await CategoryProductEntity.findOne({ order: order })

    if (existingItem) {
      const oldOrder = currentItem.order
      existingItem.order = oldOrder
      await existingItem.save()
    }

    currentItem.order = order
    await currentItem.save()

    return res.json({ code: 0, message: "Cập nhật thành công" })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const toggleActive = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const item = await CategoryProductEntity.findById(id)
    if (!item) {
      return res.status(404).json({ code: 1, message: "Banner không tồn tại" })
    }

    item.isActive = !item.isActive
    await item.save()

    return res.json({
      code: 0,
      message: "Cập nhật trạng thái thành công",
      data: toCategoryProductDTO(item)
    })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}