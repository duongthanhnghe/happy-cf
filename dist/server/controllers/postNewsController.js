import { PostNewsModel } from "../models/NewsEntity.js";
import { toPostNewsDTO, toPostNewsListDTO } from "../mappers/newsMapper.js";
export const getAllPosts = async (_, res) => {
    try {
        const posts = await PostNewsModel.find();
        return res.json({ code: 0, data: toPostNewsListDTO(posts) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getPostsById = async (req, res) => {
    try {
        const post = await PostNewsModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ code: 1, message: "Không tồn tại" });
        }
        return res.json({ code: 0, data: toPostNewsDTO(post) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const createPosts = async (req, res) => {
    try {
        const newPost = new PostNewsModel(req.body);
        await newPost.save();
        return res.status(201).json({ code: 0, message: "Tạo thành công", data: toPostNewsDTO(newPost) });
    }
    catch (err) {
        return res.status(400).json({ code: 1, message: err.message });
    }
};
export const updatePosts = async (req, res) => {
    try {
        const updated = await PostNewsModel.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updated) {
            return res.status(404).json({ code: 1, message: "Không tồn tại" });
        }
        return res.json({ code: 0, message: "Cập nhật thành công", data: toPostNewsDTO(updated) });
    }
    catch (err) {
        return res.status(400).json({ code: 1, message: err.message });
    }
};
export const deletePosts = async (req, res) => {
    try {
        const deleted = await PostNewsModel.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ code: 1, message: "Không tồn tại" });
        }
        return res.json({ code: 0, message: "Xoá thành công" });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getPostsLatest = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 5;
        const posts = await PostNewsModel.find()
            .sort({ createdAt: -1 })
            .limit(limit);
        return res.json({ code: 0, data: toPostNewsListDTO(posts) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const toggleActive = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await PostNewsModel.findById(id);
        if (!item) {
            return res.status(404).json({ code: 1, message: "item không tồn tại" });
        }
        item.isActive = !item.isActive;
        await item.save();
        return res.json({
            code: 0,
            message: "Cập nhật trạng thái thành công",
            data: toPostNewsDTO(item)
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getPostsByCategory = async (req, res) => {
    try {
        const { categoryId } = req.params;
        const page = parseInt(req.query.page, 10) || 1;
        const limit = parseInt(req.query.limit, 10) || 10;
        const skip = (page - 1) * limit;
        const query = { categoryId };
        const [total, posts] = await Promise.all([
            PostNewsModel.countDocuments(query),
            PostNewsModel.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
        ]);
        const totalPages = Math.ceil(total / limit);
        return res.json({
            code: 0,
            data: toPostNewsListDTO(posts),
            pagination: { page, limit, total, totalPages },
            message: 'Success'
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
//# sourceMappingURL=postNewsController.js.map