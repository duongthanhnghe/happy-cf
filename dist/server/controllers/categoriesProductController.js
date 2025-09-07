import { Types } from "mongoose";
import { CategoryProductEntity, ProductEntity } from "../models/ProductEntity.js";
import { toProductListDTO, toCategoryProductDTO, toCategoryProductListDTO, } from "../mappers/productMapper.js";
export const getAllCategories = async (_, res) => {
    try {
        const categories = await CategoryProductEntity.find().lean().sort({ order: 1 });
        return res.json({ code: 0, data: toCategoryProductListDTO(categories) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getCategoriesById = async (req, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ code: 1, message: "ID không hợp lệ" });
        }
        const category = await CategoryProductEntity.findById(req.params.id).lean();
        if (!category) {
            return res.status(404).json({ code: 1, message: "Danh mục không tồn tại" });
        }
        return res.json({ code: 0, data: toCategoryProductDTO(category) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const createCategories = async (req, res) => {
    try {
        const { categoryName, image } = req.body;
        if (!categoryName || !image) {
            return res.status(400).json({ code: 1, message: "Thiếu categoryName hoặc image" });
        }
        const existed = await CategoryProductEntity.findOne({ categoryName });
        if (existed) {
            return res.status(400).json({ code: 1, message: "Danh mục đã tồn tại" });
        }
        const lastItem = await CategoryProductEntity.findOne().sort({ order: -1 });
        const maxOrder = lastItem ? lastItem.order : 0;
        const newItem = new CategoryProductEntity({
            ...req.body,
            order: maxOrder + 1,
        });
        await newItem.save();
        // const newCategory = new CategoryProductEntity({ categoryName, description, image });
        return res.status(201).json({ code: 0, message: "Tạo thành công", data: toCategoryProductDTO(newItem) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const updateCategories = async (req, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ code: 1, message: "ID không hợp lệ" });
        }
        const updatedCategory = await CategoryProductEntity.findByIdAndUpdate(req.params.id, req.body, { new: true }).lean();
        if (!updatedCategory) {
            return res.status(404).json({ code: 1, message: "Danh mục không tồn tại" });
        }
        return res.json({ code: 0, message: "Cập nhật thành công", data: toCategoryProductDTO(updatedCategory) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const deleteCategories = async (req, res) => {
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
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getProductsByCategory = async (req, res) => {
    try {
        if (!Types.ObjectId.isValid(req.params.id)) {
            return res.status(400).json({ code: 1, message: "ID không hợp lệ" });
        }
        const categoryId = new Types.ObjectId(req.params.id);
        const products = await ProductEntity.find({ categoryId }).lean();
        return res.json({ code: 0, data: toProductListDTO(products) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { order } = req.body;
        const currentItem = await CategoryProductEntity.findById(id);
        if (!currentItem) {
            return res.status(404).json({ code: 1, message: "Item không tồn tại" });
        }
        const existingItem = await CategoryProductEntity.findOne({ order: order });
        if (existingItem) {
            const oldOrder = currentItem.order;
            existingItem.order = oldOrder;
            await existingItem.save();
        }
        currentItem.order = order;
        await currentItem.save();
        return res.json({ code: 0, message: "Cập nhật thành công" });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const toggleActive = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await CategoryProductEntity.findById(id);
        if (!item) {
            return res.status(404).json({ code: 1, message: "Banner không tồn tại" });
        }
        item.isActive = !item.isActive;
        await item.save();
        return res.json({
            code: 0,
            message: "Cập nhật trạng thái thành công",
            data: toCategoryProductDTO(item)
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
//# sourceMappingURL=categoriesProductController.js.map