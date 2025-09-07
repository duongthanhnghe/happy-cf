import mongoose from "mongoose";
import { ProductEntity, CategoryProductEntity } from "../models/ProductEntity.js";
import { WishlistModel } from "../models/WishlistEntity.js";
import { OrderEntity } from "../models/OrderEntity.js";
import { toProductDTO, toProductListDTO, } from "../mappers/productMapper.js";
export const getAllProduct = async (_, res) => {
    try {
        const products = await ProductEntity.find();
        return res.json({ code: 0, data: toProductListDTO(products) });
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
        const items = await WishlistModel.find({
            userId: new mongoose.Types.ObjectId(userId)
        }).populate("productId");
        return res.json({ code: 0, data: items });
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