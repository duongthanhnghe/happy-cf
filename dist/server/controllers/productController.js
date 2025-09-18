import mongoose, { Types } from "mongoose";
import { ProductEntity, CategoryProductEntity } from "../models/ProductEntity.js";
import { WishlistModel } from "../models/WishlistEntity.js";
import { OrderEntity } from "../models/OrderEntity.js";
import { toProductDTO, toProductListDTO, } from "../mappers/productMapper.js";
export const getAllProduct = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        let limit = parseInt(req.query.limit, 10) || 10;
        const query = {};
        if (limit === -1) {
            limit = await ProductEntity.countDocuments(query);
        }
        const skip = (page - 1) * limit;
        const [total, products] = await Promise.all([
            ProductEntity.countDocuments(query),
            ProductEntity.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
        ]);
        const totalPages = Math.ceil(total / limit);
        return res.json({
            code: 0,
            data: toProductListDTO(products),
            pagination: { page, limit, total, totalPages },
            message: "Success"
        });
    }
    catch (err) {
        console.error("Get all product error:", err);
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getProductById = async (req, res) => {
    try {
        const product = await ProductEntity.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ code: 1, message: "Product không tồn tại" });
        }
        return res.json({ code: 0, data: toProductDTO(product) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const createProduct = async (req, res) => {
    try {
        const data = req.body;
        if (!(data === null || data === void 0 ? void 0 : data.productName) || !(data === null || data === void 0 ? void 0 : data.image) || !(data === null || data === void 0 ? void 0 : data.categoryId) || !(data === null || data === void 0 ? void 0 : data.price)) {
            return res.status(400).json({ code: 1, message: "Thiếu dữ liệu" });
        }
        const categoryExists = await CategoryProductEntity.findById(data.categoryId);
        if (!categoryExists) {
            return res.status(400).json({ code: 1, message: "Category không tồn tại" });
        }
        const newProduct = await ProductEntity.create({
            ...data,
            categoryId: new mongoose.Types.ObjectId(data.categoryId),
        });
        return res.status(201).json({
            code: 0,
            message: "Tạo thành công",
            data: toProductDTO(newProduct),
        });
    }
    catch (err) {
        console.error("Create product error:", err);
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const data = req.body;
        if (data.categoryId) {
            data.categoryId = new mongoose.Types.ObjectId(data.categoryId);
        }
        const updated = await ProductEntity.findByIdAndUpdate(id, data, { new: true });
        if (!updated) {
            return res.status(404).json({ code: 1, message: "Product không tồn tại" });
        }
        return res.json({
            code: 0,
            message: "Cập nhật thành công",
            data: toProductDTO(updated),
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const deleteProduct = async (req, res) => {
    try {
        const deleted = await ProductEntity.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ code: 1, message: "Product không tồn tại" });
        }
        return res.json({ code: 0, message: "Xoá thành công" });
    }
    catch (err) {
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
        return res.json({ code: 0, data: mapped });
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
        res.json({
            code: 0,
            data: toProductListDTO(products.map(p => ({
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
        const products = await ProductEntity.find().lean();
        const productMap = {};
        for (const order of orders) {
            for (const item of order.cartItems) {
                const id = (_a = item.idProduct) === null || _a === void 0 ? void 0 : _a.toString(); // đảm bảo id thành string
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
        res.json({
            code: 0,
            data: toProductListDTO(topProducts.map((p) => ({
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
        res.json({
            code: 0,
            data: toProductListDTO(products.map(p => ({
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
export const toggleActive = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await ProductEntity.findById(id);
        if (!item) {
            return res.status(404).json({ code: 1, message: "product không tồn tại" });
        }
        item.isActive = !item.isActive;
        await item.save();
        return res.json({
            code: 0,
            message: "Cập nhật trạng thái thành công",
            data: toProductDTO(item)
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
//# sourceMappingURL=productController.js.map