import type { Request, Response } from "express"
import mongoose from "mongoose"
import { ProductEntity, CategoryProductEntity } from "../models/ProductEntity"
import { WishlistModel } from "../models/WishlistEntity"
import { OrderEntity } from "../models/OrderEntity"
import {
  toProductDTO,
  toProductListDTO,
} from "../mappers/productMapper"

export const getAllProduct = async (_: Request, res: Response) => {
  try {
    const products = await ProductEntity.find()
    return res.json({ code: 0, data: toProductListDTO(products) })
  } catch (err: any) {
    console.error("Get all product error:", err)
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const getProductById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const product = await ProductEntity.findById(req.params.id)
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

export const getWishlistByUserId = async (req: Request<{ userId: string }>, res: Response) => {
  try {
    const { userId } = req.params
    const items = await WishlistModel.find({
      userId: new mongoose.Types.ObjectId(userId)
    }).populate("productId")
    return res.json({ code: 0, data: items })
  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message })
  }
}

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

export const getMostOrderedProduct = async (
  req: Request<{}, {}, {}, { limit?: number }>,
  res: Response
) => {
  try {
    const limit = req.query.limit ? Number(req.query.limit) : 10;

    const orders = await OrderEntity.find().lean();
    const products = await ProductEntity.find().lean();

    const productMap: Record<string, { product: any; quantity: number }> = {};

    for (const order of orders) {
      for (const item of order.cartItems) {
        const id = item.idProduct?.toString(); // đảm bảo id thành string
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