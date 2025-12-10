import mongoose from "mongoose";
import { ProductEntity, CategoryProductEntity } from "../../../models/v1/product.entity.js";
import { toProductDTO, toProductListDTO, } from "../../../mappers/v1/product.mapper.js";
export const getAllProduct = async (req, res) => {
    try {
        const page = parseInt(req.query.page, 10) || 1;
        let limit = parseInt(req.query.limit, 10) || 10;
        const search = req.query.search || "";
        const categoryId = req.query.categoryId;
        const query = {};
        if (search.trim()) {
            query.productName = { $regex: search.trim(), $options: "i" };
        }
        if (categoryId) {
            query.categoryId = categoryId;
        }
        if (limit === -1) {
            limit = await ProductEntity.countDocuments(query);
        }
        const skip = (page - 1) * limit;
        const [total, products] = await Promise.all([
            ProductEntity.countDocuments(query),
            ProductEntity.find(query)
                .populate("category")
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
        ]);
        const totalPages = Math.ceil(total / limit);
        return res.json({
            code: 0,
            data: toProductListDTO(products),
            pagination: { page, limit, total, totalPages },
            message: "Success",
        });
    }
    catch (err) {
        console.error("Get all product error:", err);
        return res.status(500).json({ code: 1, message: err.message });
    }
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
//# sourceMappingURL=product.controller.js.map