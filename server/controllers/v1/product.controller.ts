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
import { getApplicableVouchersForProduct } from "./voucher-controller"
import { checkProductStockService } from "../../utils/productStock"

export const getAllActiveCategoryIds = async (): Promise<Types.ObjectId[]> => {
  const categories = await CategoryProductEntity.find({ isActive: true })
    .select("_id parentId")
    .lean()

  const map = new Map<string, { _id: Types.ObjectId; parentId?: Types.ObjectId | null }>()
  categories.forEach(c => map.set(c._id.toString(), c))

  const cache = new Map<string, boolean>()

  const isChainActiveSync = (id: Types.ObjectId): boolean => {
    const key = id.toString()
    if (cache.has(key)) return cache.get(key)!

    const cat = map.get(key)
    if (!cat) {
      cache.set(key, false)
      return false
    }

    if (!cat.parentId) {
      cache.set(key, true)
      return true
    }

    const parentActive = isChainActiveSync(cat.parentId)
    cache.set(key, parentActive)
    return parentActive
  }

  return categories
    .filter(c => isChainActiveSync(c._id))
    .map(c => c._id)
}

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

    const voucher = await getApplicableVouchersForProduct(product);

    const finalResult = toProductDTO(product);
    finalResult.vouchers = voucher;

    return res.json({ code: 0, data: finalResult })
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
    })
      .limit(limit)
      .sort({ createdAt: -1 })
      .lean()

    const filtered = [];
    for (const p of related) {
      if (await isCategoryChainActive(p.categoryId)) filtered.push(p);
    }

    const relatedWithVariants = await filterActiveVariantGroupsForProducts(filtered);

    const finalResult = [];
    for (const p of relatedWithVariants) {
      const voucher = await getApplicableVouchersForProduct(p);
      finalResult.push({
        ...p,
        vouchers: voucher
      });
    }

    return res.json({
      code: 0,
      data: toProductListDTO(finalResult),
      message: "Success"
    })
  } catch (err: any) {
    console.error("Get related products error:", err)
    return res.status(500).json({ code: 1, message: err.message })
  }
}

export const getProductsByIds = async (
  req: Request<{}, {}, {}, { ids?: string[]; limit?: number }>,
  res: Response
) => {
  try {
    const { ids, limit } = req.query

    if (!ids || !Array.isArray(ids) || !ids.length) {
      return res.json({
        code: 0,
        data: [],
        message: 'Empty'
      })
    }

    const idList = ids
      .map(id => id.toString())
      .filter(Types.ObjectId.isValid)

    const finalLimit = limit ? Number(limit) : idList.length

    const products = await ProductEntity.find({
      _id: { $in: idList },
      isActive: true,
    })
      .limit(finalLimit)
      .lean()

    const filtered: any[] = []
    for (const p of products) {
      if (await isCategoryChainActive(p.categoryId)) {
        filtered.push(p)
      }
    }

    const productsWithVariants =
      await filterActiveVariantGroupsForProducts(filtered)

    const finalResult: any[] = []
    for (const p of productsWithVariants) {
      const voucher = await getApplicableVouchersForProduct(p)
      finalResult.push({
        ...p,
        vouchers: voucher
      })
    }

    const orderedResult = idList
      .map(id => finalResult.find(p => p._id.toString() === id))
      .filter(Boolean)

    return res.json({
      code: 0,
      data: toProductListDTO(orderedResult),
      message: 'Success'
    })
  } catch (err: any) {
    console.error('Get products by ids error:', err)
    return res.status(500).json({
      code: 1,
      message: err.message
    })
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
  req: Request<{}, {}, {}, {
    categoryId?: string
    page?: number
    limit?: number
    sort?: string
  }>,
  res: Response
) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.max(Number(req.query.limit) || 20, 1)
    const skip = (page - 1) * limit

    let activeCategories: Types.ObjectId[] | null = null

    if (req.query.categoryId) {
      if (!Types.ObjectId.isValid(req.query.categoryId)) {
        return res.status(400).json({
          code: 1,
          message: "Category ID không hợp lệ"
        })
      }

      const categoryId = new Types.ObjectId(req.query.categoryId)

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
      ])

      const ids: Types.ObjectId[] = categories[0]?.ids || [categoryId]

      const allActive = await getAllActiveCategoryIds()

      activeCategories = ids.filter(id =>
        allActive.some(a => a.equals(id))
      )

      if (!activeCategories?.length) {
        return res.json({
          code: 0,
          data: [],
          pagination: { page, limit, total: 0, totalPages: 0 }
        })
      }
    } else {
      activeCategories = await getAllActiveCategoryIds()
    }

    const match: any = {
      isActive: true,
      amount: { $gt: 0 },
      $expr: { $lt: ["$priceDiscounts", "$price"] },
      categoryId: { $in: activeCategories }
    }

    if (activeCategories) {
      match.categoryId = { $in: activeCategories }
    }

    const total = await ProductEntity.countDocuments(match)

    const sortParam = req.query.sort
    let sortQuery: any = { updatedAt: -1, _id: 1 }

    switch (sortParam) {
      case "discount":
        sortQuery = { discountValue: -1, _id: 1 }
        break
      case "price_desc":
        sortQuery = { price: -1, _id: 1 }
        break
      case "price_asc":
        sortQuery = { price: 1, _id: 1 }
        break
      case "popular":
        sortQuery = { amountOrder: -1, _id: 1 }
        break
    }

    const products = await ProductEntity.aggregate([
      { $match: match },
      {
        $addFields: {
          price: { $toDouble: "$price" },
          priceDiscount: { $toDouble: "$priceDiscounts" },
          discountValue: {
            $cond: [
              {
                $and: [
                  { $gt: ["$price", 0] },
                  { $gt: ["$priceDiscounts", 0] }
                ]
              },
              { $subtract: ["$price", "$priceDiscounts"] },
              0
            ]
          }
        }
      },
      { $sort: sortQuery },
      { $skip: skip },
      { $limit: limit }
    ])

    const productsWithVariants =
      await filterActiveVariantGroupsForProducts(products)

    const finalResult = []
    for (const p of productsWithVariants) {
      const vouchers = await getApplicableVouchersForProduct(p)
      finalResult.push({ ...p, vouchers })
    }

    return res.json({
      code: 0,
      data: toProductListDTO(finalResult),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error: any) {
    console.error("getPromotionalProducts error:", error)
    return res.status(500).json({
      code: 1,
      message: error.message || "Server error"
    })
  }
}

export const getMostOrderedProduct = async (
  req: Request<{}, {}, {}, {
    categoryId?: string
    page?: number
    limit?: number
    sort?: string
  }>,
  res: Response
) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.max(Number(req.query.limit) || 20, 1)
    const skip = (page - 1) * limit

    let activeCategories: Types.ObjectId[] | null = null

    /* ---------------- CATEGORY FILTER ---------------- */
    if (req.query.categoryId) {
      if (!Types.ObjectId.isValid(req.query.categoryId)) {
        return res.status(400).json({
          code: 1,
          message: "Category ID không hợp lệ"
        })
      }

      const categoryId = new Types.ObjectId(req.query.categoryId)

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
      ])

      const ids: Types.ObjectId[] = categories[0]?.ids || [categoryId]
      const allActive = await getAllActiveCategoryIds()

      activeCategories = ids.filter(id =>
        allActive.some(a => a.equals(id))
      )

      if (!activeCategories?.length) {
        return res.json({
          code: 0,
          data: [],
          pagination: { page, limit, total: 0, totalPages: 0 }
        })
      }
    } else {
      activeCategories = await getAllActiveCategoryIds()
    }

    /* ---------------- MATCH PRODUCT ---------------- */
    const match: any = {
      isActive: true,
      amount: { $gt: 0 },
      categoryId: { $in: activeCategories }
    }

    const total = await ProductEntity.countDocuments(match)

    /* ---------------- SORT ---------------- */
    const sortParam = req.query.sort
    let sortQuery: any = { totalOrdered: -1, _id: 1 }

    switch (sortParam) {
      case "price_desc":
        sortQuery = { price: -1, _id: 1 }
        break
      case "price_asc":
        sortQuery = { price: 1, _id: 1 }
        break
      case "popular":
        case "discount":
        sortQuery = { discountValue: -1, _id: 1 }
        break
      default:
        sortQuery = { totalOrdered: -1, _id: 1 }
        break
    }

    const products = await ProductEntity.aggregate([
      { $match: match },

      /* join order để tính số lượng bán */
      {
        $lookup: {
          from: OrderEntity.collection.name,
          let: { productId: "$_id" },
          pipeline: [
            { $unwind: "$cartItems" },
            {
              $match: {
                $expr: {
                  $eq: ["$cartItems.idProduct", "$$productId"]
                }
              }
            },
            {
              $group: {
                _id: null,
                totalOrdered: { $sum: "$cartItems.quantity" }
              }
            }
          ],
          as: "orderStats"
        }
      },

      {
        $addFields: {
          totalOrdered: {
            $ifNull: [{ $arrayElemAt: ["$orderStats.totalOrdered", 0] }, 0]
          },
          price: { $toDouble: "$price" }
        }
      },

      { $sort: sortQuery },
      { $skip: skip },
      { $limit: limit }
    ])

    /* ---------------- VARIANT + VOUCHER ---------------- */
    const productsWithVariants =
      await filterActiveVariantGroupsForProducts(products)

    const finalResult = []
    for (const p of productsWithVariants) {
      const vouchers = await getApplicableVouchersForProduct(p)
      finalResult.push({ ...p, vouchers })
    }

    return res.json({
      code: 0,
      data: toProductListDTO(finalResult),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (error: any) {
    console.error("getMostOrderedProducts error:", error)
    return res.status(500).json({
      code: 1,
      message: error.message || "Server error"
    })
  }
}

export const getProductsByCategory = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    if (!Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ code: 1, message: "ID không hợp lệ" })
    }

    const categoryId = new Types.ObjectId(req.params.id)

    // 🔹 Lấy toàn bộ danh mục con
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
    ])

    const categoryIds = categories[0]?.ids || [categoryId]

    // 🔹 Check chuỗi category active
    const activeCategories: Types.ObjectId[] = []
    const cache = new Map<string, boolean>()

    for (const id of categoryIds) {
      if (await isCategoryChainActive(id, cache)) {
        activeCategories.push(id)
      }
    }

    if (activeCategories.length === 0) {
      return res.json({
        code: 0,
        data: [],
        pagination: { page: 1, limit: 0, total: 0, totalPages: 0 }
      })
    }

    // 🔹 Match sản phẩm
    const match = {
      categoryId: { $in: activeCategories },
      isActive: true
    }

    const page = Math.max(Number(req.query.page) || 1, 1)
    const limit = Math.max(Number(req.query.limit) || 10, 1)
    const skip = (page - 1) * limit

    const total = await ProductEntity.countDocuments(match)

    // 🔹 SORT (LUÔN ỔN ĐỊNH)
    const sort = req.query.sort as string
    let sortQuery: any = { updatedAt: -1, _id: 1 } // default

    switch (sort) {
      case "price_desc":
        sortQuery = { price: -1, _id: 1 }
        break

      case "price_asc":
        sortQuery = { price: 1, _id: 1 }
        break

      case "discount":
        sortQuery = { discountValue: -1, _id: 1 }
        break

      case "popular":
        sortQuery = { amountOrder: -1, _id: 1 }
        break
    }

    const products = await ProductEntity.aggregate([
      { $match: match },

      {
        $addFields: {
          price: { $toDouble: "$price" },
          priceDiscount: { $toDouble: "$priceDiscounts" },
          discountValue: {
            $cond: [
              {
                $and: [
                  { $gt: ["$price", 0] },
                  { $gt: ["$priceDiscounts", 0] }
                ]
              },
              { $subtract: ["$price", "$priceDiscounts"] },
              0
            ]
          }
        }
      },

      { $sort: sortQuery },

      { $skip: skip },
      { $limit: limit }
    ])

    const productsWithVariants =
      await filterActiveVariantGroupsForProducts(products)

    const productResults = []
    for (const p of productsWithVariants) {
      const vouchers = await getApplicableVouchersForProduct(p)
      productResults.push({ ...p, vouchers })
    }

    return res.json({
      code: 0,
      data: toProductListDTO(productResults),
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      }
    })

  } catch (err: any) {
    console.error("getProductsByCategory error:", err)
    return res.status(500).json({ code: 1, message: err.message })
  }
}

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

// export const checkProductStock = async (
//   req: Request,
//   res: Response
// ) => {
//   try {
//     const { productId, combinationId, quantity } = req.body

//     if (!productId || !quantity || quantity <= 0) {
//       return res.status(400).json({
//         code: 1,
//         message: 'Thiếu dữ liệu kiểm tra tồn kho'
//       })
//     }

//     const product = await ProductEntity.findById(productId)
//       .select('amount variantCombinations')

//     if (!product) {
//       return res.status(404).json({
//         code: 1,
//         message: 'Sản phẩm không tồn tại'
//       })
//     }

//     // ✅ SẢN PHẨM KHÔNG VARIANT
//     if (!combinationId) {
//       const stock = product.amount || 0

//       return res.json({
//         code: 0,
//         ok: quantity <= stock,
//         availableStock: stock
//       })
//     }

//     // ✅ SẢN PHẨM CÓ VARIANT
//     const combination = product.variantCombinations?.find(
//       c => c._id.toString() === combinationId
//     )

//     if (!combination) {
//       return res.status(404).json({
//         code: 1,
//         message: 'Phân loại không tồn tại'
//       })
//     }

//     const stock = combination.stock || 0

//     return res.json({
//       code: 0,
//       ok: quantity <= stock,
//       availableStock: stock
//     })
//   } catch (err: any) {
//     return res.status(500).json({
//       code: 1,
//       message: err.message
//     })
//   }
// }
export const checkProductStock = async (req: Request, res: Response) => {
  try {
    const result = await checkProductStockService(req.body)
    return res.json({ code: 0, ...result })
  } catch (e: any) {
    return res.status(400).json({ code: 1, message: e.message })
  }
}