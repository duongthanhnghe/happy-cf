import type { Request, Response } from "express"
import type { PipelineStage } from "mongoose"
import mongoose, { Types } from "mongoose"
import { ProductEntity, CategoryProductEntity, type Product } from "../../models/v1/product.entity"
import { WishlistModel } from "../../models/v1/wishlist.entity"
import { OrderEntity } from "../../models/v1/order.entity"
import {
  toProductDTO,
  toProductListDTO,
} from "../../mappers/v1/product.mapper"
import { VariantGroupEntity } from "../../../server/models/v1/variant-group.entity"

export const isCategoryChainActive = async (categoryId: Types.ObjectId | null, cache = new Map()): Promise<boolean> => {
  if (!categoryId) return false;

  const key = categoryId.toString();
  if (cache.has(key)) return cache.get(key);

  const category = await CategoryProductEntity.findById(categoryId).lean();
  if (!category) {
    cache.set(key, false);
    return false;
  }
  if (!category.isActive) {
    cache.set(key, false);
    return false;
  }

  if (!category.parentId) {
    cache.set(key, true);
    return true;
  }

  const parentActive = await isCategoryChainActive(category.parentId, cache);
  cache.set(key, parentActive);
  return parentActive;
};

// Dành cho Product (từ DB)
export const filterActiveVariantGroupsForProduct = async (product: Product | Product[]): Promise<Product | Product[]> => {
  if (Array.isArray(product)) {
    return Promise.all(product.map(p => filterActiveVariantGroupsForProduct(p) as Promise<Product>))
  }

  const groupIds = product.variantGroups.map(vg => vg.groupId)
  if (!groupIds.length) return product

  const activeGroups = await VariantGroupEntity.find({
    _id: { $in: groupIds },
    isActive: true
  }).lean()

  const activeGroupIds = new Set(activeGroups.map(g => g._id.toString()))
  product.variantGroups = product.variantGroups.filter(vg => activeGroupIds.has(vg.groupId))

  return product
}

// Chỉ nhận mảng Product
export const filterActiveVariantGroupsForProducts = async (products: Product[]): Promise<Product[]> => {
  if (!products.length) return products;

  const allGroupIds = products.flatMap(p => p.variantGroups.map(vg => vg.groupId));
  if (!allGroupIds.length) return products;

  const activeGroups = await VariantGroupEntity.find({
    _id: { $in: allGroupIds },
    isActive: true
  }).lean();

  const activeGroupIds = new Set(activeGroups.map(g => g._id.toString()));

  products.forEach(p => {
    p.variantGroups = p.variantGroups.filter(vg => activeGroupIds.has(vg.groupId));
  });

  return products;
};
////// END HELPERS

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

    const isActiveChain = await isCategoryChainActive(product.categoryId);
    if (!isActiveChain) {
      return res.status(404).json({ code: 1, message: "Danh mục của sản phẩm đã bị vô hiệu hóa" });
    }

    product = await filterActiveVariantGroupsForProduct(product) as Product;

    return res.json({ code: 0, data: toProductDTO(product) })
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

    const filtered = [];
    for (const p of related) {
      if (await isCategoryChainActive(p.categoryId)) filtered.push(p);
    }

    const relatedWithVariants = await filterActiveVariantGroupsForProducts(filtered);

    return res.json({
      code: 0,
      data: toProductListDTO(relatedWithVariants),
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

    const filtered: typeof mapped = [];
    for (const item of mapped) {
      if (
        await isCategoryChainActive(
          new mongoose.Types.ObjectId(item.product.categoryId)
        )
      ) {
        filtered.push(item);
      }
    }

    return res.json({ code: 0, data: filtered });
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

    const filtered = [];
    for (const p of products) {
      if (await isCategoryChainActive(p.categoryId)) filtered.push(p);
    }

    const productsWithVariants = await filterActiveVariantGroupsForProducts(filtered);

    res.json({
      code: 0,
      data: toProductListDTO(
        productsWithVariants.map(p => ({
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

    const topProductsAgg = await OrderEntity.aggregate([
      { $unwind: "$cartItems" },
      { $match: { "cartItems.idProduct": { $exists: true } } },
      {
        $group: {
          _id: "$cartItems.idProduct",
          totalOrdered: { $sum: "$cartItems.quantity" }
        }
      },
      { $sort: { totalOrdered: -1 } },
      { $limit: limit }
    ]);

    const productIds = topProductsAgg.map(p => p._id).filter(Types.ObjectId.isValid);

    if (!productIds.length) {
      return res.json({ code: 0, data: [], message: "Success" });
    }

    const products = await ProductEntity.find({
      _id: { $in: productIds },
      isActive: true,
      amount: { $gt: 0 }
    }).lean();

    const productsWithQuantity = products.map(p => {
      const found = topProductsAgg.find(tp => tp._id.toString() === p._id.toString());
      return { ...p, totalOrdered: found?.totalOrdered || 0 };
    });

    const filtered: Product[] = [];
    for (const p of productsWithQuantity) {
      if (await isCategoryChainActive(p.categoryId)) filtered.push(p);
    }

    const productsWithVariants = await filterActiveVariantGroupsForProducts(filtered);

    return res.json({
      code: 0,
      data: toProductListDTO(productsWithVariants),
      message: "Success"
    });

  } catch (error: any) {
    console.error("getMostOrderedProduct error:", error);
    return res.status(500).json({ code: 1, message: "Server error" });
  }
};

export const getProductsByCategory = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ code: 1, message: "ID không hợp lệ" });
    }

    const categoryId = new Types.ObjectId(req.params.id);

    const categories = await CategoryProductEntity.aggregate([
      { $match: { _id: categoryId } },
      {
        $graphLookup: {
          from: CategoryProductEntity.collection.name,
          startWith: "$_id",
          connectFromField: "_id",
          connectToField: "parentId",
          as: "descendants"
        }
      },
      {
        $project: {
          ids: { $concatArrays: [["$_id"], "$descendants._id"] }
        }
      }
    ]);

    const categoryIds = categories[0]?.ids || [categoryId];

    const activeCategories = [];
    const cache = new Map();

    for (const id of categoryIds) {
      if (await isCategoryChainActive(id, cache)) {
        activeCategories.push(id);
      }
    }

    if (activeCategories.length === 0) {
      return res.json({ code: 0, data: [], pagination: { page: 1, limit: 0, total: 0, totalPages: 0 } });
    }

    const match = {
      categoryId: { $in: activeCategories },
      isActive: true
    };

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const total = await ProductEntity.countDocuments(match);

    let sortQuery: any = { updatedAt: -1 }; // default

    const sort = req.query.sort as string;

    switch (sort) {
      case "price_desc":
        sortQuery = { price: -1 };
        break;

      case "price_asc":
        sortQuery = { price: 1 };
        break;

      case "discount":
        sortQuery = { 
          discountValue: -1 
        };
        break;

      case "popular":
        sortQuery = { amountOrder: -1 };
        break;
    }


    const products = await ProductEntity.aggregate([
      { $match: match },
      {
        $addFields: {
          price: { $toDouble: "$price" },
          priceDiscount: { $toDouble: "$priceDiscounts" }
        }
      },
      { $sort: sortQuery },
      // { $sort: { updatedAt: -1 } },
      { $skip: skip },
      { $limit: limit }
    ]);

    const productsWithVariants = await filterActiveVariantGroupsForProducts(products);

    return res.json({
      code: 0,
      data: toProductListDTO(productsWithVariants),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (err: any) {
    return res.status(500).json({ code: 1, message: err.message });
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

    const filtered = [];
    for (const p of products) {
      if (await isCategoryChainActive(p.categoryId)) filtered.push(p);
    }

    const productsWithVariants = await filterActiveVariantGroupsForProducts(filtered);

    res.json({
      code: 0,
      data: toProductListDTO(
        productsWithVariants.map(p => ({
          ...p,
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

export const getCartProducts = async (
  req: Request<{}, {}, { ids: string[] }>,
  res: Response
) => {
  try {
    const { ids } = req.body

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ code: 1, message: "Danh sách sản phẩm không hợp lệ" })
    }

    const productIds = ids
      .filter(id => Types.ObjectId.isValid(id))
      .map(id => new Types.ObjectId(id))

    const products = await ProductEntity.find({
      _id: { $in: productIds },
      isActive: true
    })
      .lean()

    const filtered = [];
    for (const p of products) {
      if (await isCategoryChainActive(p.categoryId)) filtered.push(p);
    }  

    const productsWithVariants = await filterActiveVariantGroupsForProducts(filtered);

    return res.json({
      code: 0,
      data: toProductListDTO(productsWithVariants),
      message: "Load cart success"
    })
  } catch (error: any) {
    console.error("getCartProducts error:", error)
    return res.status(500).json({ code: 1, message: "Server error" })
  }
}