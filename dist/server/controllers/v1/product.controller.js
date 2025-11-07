import mongoose, { Types } from "mongoose";
import { ProductEntity, CategoryProductEntity } from "../../models/v1/product.entity.js";
import { WishlistModel } from "../../models/v1/wishlist.entity.js";
import { OrderEntity } from "../../models/v1/order.entity.js";
import { toProductDTO, toProductListDTO, } from "../../mappers/v1/product.mapper.js";
// export const isCategoryChainActive = async (categoryId: Types.ObjectId | null): Promise<boolean> => {
//   if (!categoryId) return false;
//   let currentId = categoryId;
//   while (currentId) {
//     const category = await CategoryProductEntity.findById(currentId).lean();
//     if (!category) return false;
//     if (!category.isActive) return false;
//     if (!category.parentId) return true;
//     currentId = category.parentId;
//   }
//   return true;
// };
export const isCategoryChainActive = async (categoryId, cache = new Map()) => {
    if (!categoryId)
        return false;
    const key = categoryId.toString();
    if (cache.has(key))
        return cache.get(key);
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
export const getProductById = async (req, res) => {
    try {
        let product;
        if (/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
            product = await ProductEntity.findById(req.params.id);
        }
        else {
            product = await ProductEntity.findOne({ slug: req.params.id });
        }
        if (!product) {
            return res.status(404).json({ code: 1, message: "Product không tồn tại" });
        }
        const isActiveChain = await isCategoryChainActive(product.categoryId);
        if (!isActiveChain) {
            return res.status(404).json({ code: 1, message: "Danh mục của sản phẩm đã bị vô hiệu hóa" });
        }
        return res.json({ code: 0, data: toProductDTO(product) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getRelatedProducts = async (req, res) => {
    try {
        const { slug } = req.params;
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const product = await ProductEntity.findOne({ slug }).lean();
        if (!product) {
            return res.status(404).json({ code: 1, message: "Product không tồn tại" });
        }
        const related = await ProductEntity.find({
            _id: { $ne: product._id },
            categoryId: product.categoryId,
            isActive: true,
            amount: { $gt: 0 }
        })
            .limit(limit)
            .sort({ createdAt: -1 })
            .lean();
        const filtered = [];
        for (const p of related) {
            if (await isCategoryChainActive(p.categoryId))
                filtered.push(p);
        }
        return res.json({
            code: 0,
            data: toProductListDTO(filtered),
            message: "Success"
        });
    }
    catch (err) {
        console.error("Get related products error:", err);
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getWishlistByUserId = async (req, res) => {
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
        const filtered = [];
        for (const item of mapped) {
            if (await isCategoryChainActive(new mongoose.Types.ObjectId(item.product.categoryId))) {
                filtered.push(item);
            }
        }
        return res.json({ code: 0, data: filtered });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const addWishlistItem = async (req, res) => {
    try {
        const { userId } = req.params;
        const { productId } = req.body;
        if (!productId)
            return res.status(400).json({ code: 1, message: "productId is required" });
        const existed = await WishlistModel.findOne({ userId, productId });
        if (existed)
            return res.status(409).json({ code: 1, message: "Already in wishlist" });
        const newItem = await WishlistModel.create({ userId, productId });
        return res.status(201).json({ code: 0, data: newItem });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const deleteWishlistItem = async (req, res) => {
    try {
        const { userId, productId } = req.params;
        const deleted = await WishlistModel.findOneAndDelete({ userId, productId });
        if (!deleted)
            return res.status(404).json({ code: 1, message: "Not found" });
        return res.json({ code: 0, message: "Deleted" });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getPromotionalProducts = async (req, res) => {
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 20;
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
        ]);
        const filtered = [];
        for (const p of products) {
            if (await isCategoryChainActive(p.categoryId))
                filtered.push(p);
        }
        res.json({
            code: 0,
            data: toProductListDTO(filtered.map(p => ({
                ...p,
                isPromotional: true,
                discountPercent: p.price && p.priceDiscounts
                    ? Math.round(((p.price - p.priceDiscounts) / p.price) * 100)
                    : 0
            })))
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({
            code: 1,
            message: "Server error"
        });
    }
};
export const getMostOrderedProduct = async (req, res) => {
    var _a;
    try {
        const limit = req.query.limit ? Number(req.query.limit) : 10;
        const orders = await OrderEntity.find().lean();
        const products = await ProductEntity.find({ isActive: true, amount: { $gt: 0 } }).lean();
        const productMap = {};
        for (const order of orders) {
            for (const item of order.cartItems) {
                const id = (_a = item.idProduct) === null || _a === void 0 ? void 0 : _a.toString();
                if (!id)
                    continue;
                if (!productMap[id]) {
                    const productInfo = products.find((p) => p._id.toString() === id);
                    if (!productInfo)
                        continue;
                    productMap[id] = { product: productInfo, quantity: 0 };
                }
                productMap[id].quantity += item.quantity || 1;
            }
        }
        const topProducts = Object.values(productMap)
            .sort((a, b) => b.quantity - a.quantity)
            .slice(0, limit);
        const filtered = [];
        for (const p of topProducts) {
            if (await isCategoryChainActive(p.product.categoryId))
                filtered.push(p);
        }
        res.json({
            code: 0,
            data: toProductListDTO(filtered.map((p) => ({
                ...p.product,
                totalOrdered: p.quantity,
            }))),
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ code: 1, message: "Server error" });
    }
};
export const getProductsByCategory = async (req, res) => {
    var _a;
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ code: 1, message: "ID không hợp lệ" });
        }
        const categoryId = new Types.ObjectId(req.params.id);
        const categories = await CategoryProductEntity.aggregate([
            { $match: { _id: categoryId } },
            {
                $graphLookup: {
                    from: "product_categories", // 👈 tên collection (mặc định là model name viết thường + "s")
                    startWith: "$_id",
                    connectFromField: "_id",
                    connectToField: "parentId",
                    as: "descendants"
                }
            },
            {
                $project: {
                    ids: {
                        $concatArrays: [["$_id"], "$descendants._id"]
                    }
                }
            }
        ]);
        const categoryIds = ((_a = categories[0]) === null || _a === void 0 ? void 0 : _a.ids) || [categoryId];
        const page = parseInt(req.query.page, 10) || 1;
        let limit = parseInt(req.query.limit, 10) || 10;
        const sortType = req.query.sort || "default";
        if (limit === -1) {
            limit = await ProductEntity.countDocuments({
                categoryId: { $in: categoryIds },
                isActive: true
            });
        }
        const skip = (page - 1) * limit;
        const [total, products] = await Promise.all([
            ProductEntity.countDocuments({
                categoryId: { $in: categoryIds },
                isActive: true
            }),
            ProductEntity.aggregate([
                { $match: { categoryId: { $in: categoryIds }, isActive: true } },
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
                    $sort: sortType === "discount"
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
        const cache = new Map();
        const filtered = [];
        for (const p of products) {
            const active = await isCategoryChainActive(new mongoose.Types.ObjectId(p.categoryId), cache);
            if (active)
                filtered.push(p);
        }
        const totalPages = Math.ceil(total / limit);
        return res.json({
            code: 0,
            data: toProductListDTO(filtered),
            pagination: { page, limit, total, totalPages: filtered.length },
            message: "Success",
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const searchProducts = async (req, res) => {
    var _a;
    try {
        const keyword = ((_a = req.query.keyword) === null || _a === void 0 ? void 0 : _a.trim()) || "";
        const page = req.query.page ? Number(req.query.page) : 1;
        const limit = req.query.limit ? Number(req.query.limit) : 20;
        const skip = (page - 1) * limit;
        const matchStage = {
            isActive: true,
            amount: { $gt: 0 },
        };
        if (keyword) {
            matchStage.$or = [
                { productName: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
                { summaryContent: { $regex: keyword, $options: "i" } }
            ];
        }
        const pipeline = [
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
        ];
        const [products, totalCount] = await Promise.all([
            ProductEntity.aggregate(pipeline),
            ProductEntity.countDocuments(matchStage)
        ]);
        const filtered = [];
        for (const p of products) {
            if (await isCategoryChainActive(p.categoryId))
                filtered.push(p);
        }
        res.json({
            code: 0,
            data: toProductListDTO(filtered.map(p => ({
                ...p,
                isPromotional: p.discountPercent > 0
            }))),
            pagination: {
                total: totalCount,
                page: page,
                totalPages: Math.ceil(totalCount / limit),
                limit: limit
            }
        });
    }
    catch (error) {
        console.error("Error searching products:", error);
        res.status(500).json({
            code: 1,
            message: "Server error"
        });
    }
};
export const getCartProducts = async (req, res) => {
    try {
        const { ids } = req.body;
        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({ code: 1, message: "Danh sách sản phẩm không hợp lệ" });
        }
        const productIds = ids
            .filter(id => Types.ObjectId.isValid(id))
            .map(id => new Types.ObjectId(id));
        const products = await ProductEntity.find({
            _id: { $in: productIds },
            isActive: true
        })
            .lean();
        const filtered = [];
        for (const p of products) {
            if (await isCategoryChainActive(p.categoryId))
                filtered.push(p);
        }
        return res.json({
            code: 0,
            data: toProductListDTO(filtered),
            message: "Load cart success"
        });
    }
    catch (error) {
        console.error("getCartProducts error:", error);
        return res.status(500).json({ code: 1, message: "Server error" });
    }
};
//# sourceMappingURL=product.controller.js.map