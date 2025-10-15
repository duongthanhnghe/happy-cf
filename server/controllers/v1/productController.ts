import type { Request, Response } from "express"
import type { PipelineStage } from "mongoose"
import mongoose, { Types } from "mongoose"
import { ProductEntity, CategoryProductEntity } from "../../models/v1/ProductEntity"
import { WishlistModel } from "../../models/v1/WishlistEntity"
import { OrderEntity } from "../../models/v1/OrderEntity"
import {
  toProductDTO,
  toProductListDTO,
} from "../../mappers/v1/productMapper"

export const getAllProduct = async (req: Request, res: Response) => {
  try {
    const page = parseInt(req.query.page as string, 10) || 1
    let limit = parseInt(req.query.limit as string, 10) || 10

    const query: any = {}

    if (limit === -1) {
      limit = await ProductEntity.countDocuments(query)
    }

    const skip = (page - 1) * limit

    const [total, products] = await Promise.all([
      ProductEntity.countDocuments(query),
      ProductEntity.find(query)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
    ])

    const totalPages = Math.ceil(total / limit)

    return res.json({
      code: 0,
      data: toProductListDTO(products),
      pagination: { page, limit, total, totalPages },
      message: "Success"
    })
  } catch (err: any) {
    console.error("Get all product error:", err)
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const getProductById = async (req: Request<{ id: string }>, res: Response) => {
  try {

    let product
    if (/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
      product = await ProductEntity.findById(req.params.id)
    } else {
      product = await ProductEntity.findOne({ slug: req.params.id })
    }

    if (!product) {
      return res.status(404).json({ code: 1, message: "Product không tồn tại" })
    }

    return res.json({ code: 0, data: toProductDTO(product) })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const createProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body

    if (!data?.productName || !data?.image || !data?.categoryId || !data?.price) {
      return res.status(400).json({ code: 1, message: "Thiếu dữ liệu" })
    }

    const categoryExists = await CategoryProductEntity.findById(data.categoryId)
    if (!categoryExists) {
      return res.status(400).json({ code: 1, message: "Category không tồn tại" })
    }

    const newProduct = await ProductEntity.create({
      ...data,
      categoryId: new mongoose.Types.ObjectId(data.categoryId),
    })

    return res.status(201).json({
      code: 0,
      message: "Tạo thành công",
      data: toProductDTO(newProduct),
    })
  } catch (err: any) {
    console.error("Create product error:", err)
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const updateProduct = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const { id } = req.params
    const data = req.body

    if (data.categoryId) {
      data.categoryId = new mongoose.Types.ObjectId(data.categoryId)
    }

    const updated = await ProductEntity.findByIdAndUpdate(id, data, { new: true })
    if (!updated) {
      return res.status(404).json({ code: 1, message: "Product không tồn tại" })
    }

    return res.json({
      code: 0,
      message: "Cập nhật thành công",
      data: toProductDTO(updated),
    })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const deleteProduct = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const deleted = await ProductEntity.findByIdAndDelete(req.params.id)
    if (!deleted) {
      return res.status(404).json({ code: 1, message: "Product không tồn tại" })
    }
    return res.json({ code: 0, message: "Xoá thành công" })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const getRelatedProducts = async (
  req: Request<{ slug: string }, {}, {}, { limit?: number }>,
  res: Response
) => {
  try {
    const { slug } = req.params
    const limit = req.query.limit ? Number(req.query.limit) : 10

    const product = await ProductEntity.findOne({ slug }).lean()
    if (!product) {
      return res.status(404).json({ code: 1, message: "Product không tồn tại" })
    }

    const related = await ProductEntity.find({
      _id: { $ne: product._id },            
      categoryId: product.categoryId,     
      isActive: true,
      amount: { $gt: 0 }
    })
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()

    return res.json({
      code: 0,
      data: toProductListDTO(related),
      message: "Success"
    })
  } catch (err: any) {
    console.error("Get related products error:", err)
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const getWishlistByUserId = async (
  req: Request<{ userId: string }>, 
  res: Response
) => {
  try {
    const { userId } = req.params;

    if (!Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ code: 1, message: "Invalid userId" });
    }

    const items = await WishlistModel.aggregate([
      {
        $match: {
          userId: new mongoose.Types.ObjectId(userId),
        },
      },
      {
        $lookup: {
          from: "products",
          localField: "productId",
          foreignField: "_id",
          as: "product",
        },
      },
      { $unwind: "$product" },
      {
        $match: {
          "product.isActive": true,
        },
      },
      {
        $project: {
          _id: 1,
          userId: 1,
          createdAt: 1,
          product: 1,
        },
      },
    ]);

    const mapped = items.map(item => ({
      id: item._id.toString(),            
      userId: item.userId.toString(),
      createdAt: item.createdAt,
      product: toProductDTO(item.product),
    }));

    return res.json({ code: 0, data: mapped });
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
  }
};

export const addWishlistItem = async (
  req: Request<{ userId: string }, {}, { productId: string }>,
  res: Response
) => {
  try {
    const { userId } = req.params
    const { productId } = req.body

    if (!productId) return res.status(400).json({ code: 1, message: "productId is required" })

    const existed = await WishlistModel.findOne({ userId, productId })
    if (existed) return res.status(409).json({ code: 1, message: "Already in wishlist" })

    const newItem = await WishlistModel.create({ userId, productId })
    return res.status(201).json({ code: 0, data: newItem })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const deleteWishlistItem = async (
  req: Request<{ userId: string; productId: string }>,
  res: Response
) => {
  try {
    const { userId, productId } = req.params
    const deleted = await WishlistModel.findOneAndDelete({ userId, productId })
    if (!deleted) return res.status(404).json({ code: 1, message: "Not found" })
    return res.json({ code: 0, message: "Deleted" })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const getPromotionalProducts = async (
  req: Request<{}, {}, {}, { limit?: number }>,
  res: Response
) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 20

    const products = await ProductEntity.aggregate([
      {
        $match: {
          isActive: true,
          amount: { $gt: 0 },
          $expr: { $lt: ["$priceDiscounts", "$price"] }
        }
      },
      {
        $addFields: {
          discountPercent: {
            $cond: [
              { $and: [{ $ifNull: ["$price", false] }, { $ifNull: ["$priceDiscounts", false] }] },
              {
                $round: [
                  { $multiply: [{ $divide: [{ $subtract: ["$price", "$priceDiscounts"] }, "$price"] }, 100] },
                  0
                ]
              },
              0
            ]
          }
        }
      },
      { $sort: { discountPercent: -1 } },
      { $limit: limit }
    ])

    res.json({
      code: 0,
      data: toProductListDTO(
        products.map(p => ({
          ...p,
          isPromotional: true,
          discountPercent: p.price && p.priceDiscounts
            ? Math.round(((p.price - p.priceDiscounts) / p.price) * 100)
            : 0
        }))
      )
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      code: 1,
      message: "Server error"
    })
  }
}


export const getMostOrderedProduct = async (
  req: Request<{}, {}, {}, { limit?: number }>,
  res: Response
) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const orders = await OrderEntity.find().lean();
    const products = await ProductEntity.find({ isActive: true, amount: { $gt: 0 } }).lean();

    const productMap: Record<string, { product: any; quantity: number }> = {};

    for (const order of orders) {
      for (const item of order.cartItems) {
        const id = item.idProduct?.toString(); 
        if (!id) continue;

        if (!productMap[id]) {
          const productInfo = products.find(
            (p) => p._id.toString() === id
          );
          if (!productInfo) continue;

          productMap[id] = { product: productInfo, quantity: 0 };
        }

        productMap[id].quantity += item.quantity || 1;
      }
    }

    const topProducts = Object.values(productMap)
      .sort((a, b) => b.quantity - a.quantity)
      .slice(0, limit);

    res.json({
      code: 0,
      data: toProductListDTO(topProducts.map((p) =>
        ({
          ...p.product,
          totalOrdered: p.quantity,
        })
      )),
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ code: 1, message: "Server error" });
  }
};

export const searchProducts = async (
  req: Request<{}, {}, {}, { keyword?: string; page?: number; limit?: number }>,
  res: Response
) => {
  try {
    const keyword = req.query.keyword?.trim() || ""
    const page = req.query.page ? Number(req.query.page) : 1
    const limit = req.query.limit ? Number(req.query.limit) : 20
    const skip = (page - 1) * limit

    const matchStage: any = {
      isActive: true,
      amount: { $gt: 0 },
    }

    if (keyword) {
      matchStage.$or = [
        { productName: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
        { summaryContent: { $regex: keyword, $options: "i" } }
      ]
    }

    const pipeline: PipelineStage[] = [
      { $match: matchStage },
      {
        $addFields: {
          discountPercent: {
            $cond: [
              { $and: [{ $ifNull: ["$price", false] }, { $ifNull: ["$priceDiscounts", false] }] },
              {
                $round: [
                  {
                    $multiply: [
                      { $divide: [{ $subtract: ["$price", "$priceDiscounts"] }, "$price"] },
                      100
                    ]
                  },
                  0
                ]
              },
              0
            ]
          }
        }
      },
      { $sort: { discountPercent: -1, amount: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]

    const [products, totalCount] = await Promise.all([
      ProductEntity.aggregate(pipeline),
      ProductEntity.countDocuments(matchStage)
    ])

    res.json({
      code: 0,
      data: toProductListDTO(
        products.map(p => ({
          ...p,
          isPromotional: p.discountPercent > 0
        }))
      ),
      pagination: {
        total: totalCount,
        page: page,
        totalPages: Math.ceil(totalCount / limit),
        limit: limit
      }
    })
  } catch (error) {
    console.error("Error searching products:", error)
    res.status(500).json({
      code: 1,
      message: "Server error"
    })
  }
}

export const toggleActive = async (req: Request, res: Response) => {
  try {
    const { id } = req.params

    const item = await ProductEntity.findById(id)
    if (!item) {
      return res.status(404).json({ code: 1, message: "product không tồn tại" })
    }

    item.isActive = !item.isActive
    await item.save()

    return res.json({
      code: 0,
      message: "Cập nhật trạng thái thành công",
      data: toProductDTO(item)
    })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}