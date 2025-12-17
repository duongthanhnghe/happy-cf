import { CategoryNewsModel, PostNewsModel } from "../../../models/v1/news.entity.js";
import { toCategoryNewsDTO, toCategoryNewsListDTO } from "../../../mappers/v1/news.mapper.js";
export const getAllCategories = async (req, res) => {
    try {
        const page = Math.max(Number(req.query.page) || 1, 1);
        const limit = Math.max(Number(req.query.limit) || 20, 1);
        const search = req.query.search || '';
        const skip = (page - 1) * limit;
        const filter = {};
        if (search) {
            filter.categoryName = { $regex: search, $options: 'i' };
        }
        const [items, total] = await Promise.all([
            CategoryNewsModel
                .find(filter)
                .sort({ order: 1, createdAt: -1 })
                .skip(skip)
                .limit(limit),
            CategoryNewsModel.countDocuments(filter),
        ]);
        return res.json({
            code: 0,
            data: toCategoryNewsListDTO(items),
            pagination: {
                page,
                limit,
                total,
                totalPages: Math.ceil(total / limit),
            },
        });
    }
    catch (err) {
        return res.status(500).json({
            code: 1,
            message: err.message || 'Lỗi khi lấy danh sách danh mục',
        });
    }
};
export const getCategoriesById = async (req, res) => {
    try {
        const { id } = req.params;
        const category = await CategoryNewsModel.findById(id);
        if (!category) {
            return res.status(404).json({ code: 1, message: "Category không tồn tại" });
        }
        return res.json({
            code: 0,
            data: toCategoryNewsDTO(category),
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const createCategories = async (req, res) => {
    try {
        const { categoryName } = req.body;
        if (!categoryName) {
            return res.status(400).json({ code: 1, message: "Thiếu categoryName" });
        }
        const lastItem = await CategoryNewsModel.findOne().sort({ order: -1 });
        const maxOrder = lastItem ? lastItem.order : 0;
        const newItem = new CategoryNewsModel({
            ...req.body,
            order: maxOrder + 1,
        });
        await newItem.save();
        return res.status(201).json({
            code: 0,
            message: "Tạo thành công",
            data: toCategoryNewsDTO(newItem),
        });
    }
    catch (err) {
        return res.status(400).json({ code: 1, message: err.message });
    }
};
export const updateCategories = async (req, res) => {
    try {
        const { id } = req.params;
        const updated = await CategoryNewsModel.findByIdAndUpdate(id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ code: 1, message: "Category không tồn tại" });
        }
        return res.json({
            code: 0,
            message: "Cập nhật thành công",
            data: toCategoryNewsDTO(updated),
        });
    }
    catch (err) {
        return res.status(400).json({ code: 1, message: err.message });
    }
};
export const deleteCategories = async (req, res) => {
    try {
        const { id } = req.params;
        const newsCount = await PostNewsModel.countDocuments({ categoryId: id });
        if (newsCount > 0) {
            return res.status(400).json({
                code: 1,
                message: "Không thể xoá, vẫn còn bài viết thuộc nhóm này",
            });
        }
        const deleted = await CategoryNewsModel.findByIdAndDelete(id);
        if (!deleted) {
            return res.status(404).json({ code: 1, message: "Category không tồn tại" });
        }
        return res.json({ code: 0, message: "Xoá thành công" });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const updateOrder = async (req, res) => {
    try {
        const { id } = req.params;
        const { order } = req.body;
        const currentItem = await CategoryNewsModel.findById(id);
        if (!currentItem) {
            return res.status(404).json({ code: 1, message: "Item không tồn tại" });
        }
        const existingItem = await CategoryNewsModel.findOne({ order: order });
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
        const item = await CategoryNewsModel.findById(id);
        if (!item) {
            return res.status(404).json({ code: 1, message: "category không tồn tại" });
        }
        item.isActive = !item.isActive;
        await item.save();
        return res.json({
            code: 0,
            message: "Cập nhật trạng thái thành công",
            data: toCategoryNewsDTO(item)
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
//# sourceMappingURL=categories-news.controller.js.map