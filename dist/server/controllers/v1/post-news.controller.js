import { PostNewsModel, CategoryNewsModel } from "../../models/v1/news.entity.js";
import { toPostNewsDTO, toPostNewsListDTO } from "../../mappers/v1/news.mapper.js";
import mongoose, { Types } from "mongoose";
export const isNewsCategoryActive = async (categoryId) => {
    if (!categoryId)
        return false;
    const category = await CategoryNewsModel.findById(categoryId).lean();
    if (!category)
        return false;
    return category.isActive === true;
};
export const getPostsById = async (req, res) => {
    try {
        const post = await PostNewsModel.findById(req.params.id);
        if (!post) {
            return res.status(404).json({ code: 1, message: "Không tồn tại" });
        }
        if (!post.isActive) {
            return res.status(404).json({ code: 1, message: "Bài viết đã bị vô hiệu hóa" });
        }
        const isActiveCategory = await isNewsCategoryActive(post.categoryId);
        if (!isActiveCategory) {
            return res.status(404).json({ code: 1, message: "Danh mục của bài viết đã bị vô hiệu hóa" });
        }
        return res.json({ code: 0, data: toPostNewsDTO(post) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const post = await PostNewsModel.findOne({ slug }).populate('categoryId');
        if (!post) {
            return res.status(404).json({ code: 1, message: "Không tồn tại" });
        }
        if (!post.isActive) {
            return res.status(404).json({ code: 1, message: "Bài viết đã bị vô hiệu hóa" });
        }
        const isActiveCategory = await isNewsCategoryActive(post.categoryId);
        if (!isActiveCategory) {
            return res.status(404).json({ code: 1, message: "Danh mục của bài viết đã bị vô hiệu hóa" });
        }
        return res.json({ code: 0, data: toPostNewsDTO(post) });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getPostsLatest = async (req, res) => {
    try {
        const limit = parseInt(req.query.limit, 10) || 5;
        const posts = await PostNewsModel.aggregate([
            { $match: { isActive: true } },
            {
                $lookup: {
                    from: "post_categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: false } },
            { $match: { "category.isActive": true } },
            // thêm categoryName
            { $addFields: { categoryName: "$category.categoryName" } },
            { $sort: { createdAt: -1 } },
            { $limit: limit },
            { $project: { category: 0 } }
        ]);
        return res.json({
            code: 0,
            data: posts.map(toPostNewsDTO),
            message: "Success"
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
        const isActiveCategory = await isNewsCategoryActive(new Types.ObjectId(categoryId));
        if (!isActiveCategory) {
            return res.status(404).json({ code: 1, message: "Danh mục đã bị vô hiệu hóa" });
        }
        const query = { categoryId, isActive: true };
        const [total, posts] = await Promise.all([
            PostNewsModel.countDocuments(query),
            PostNewsModel.find(query)
                .populate('categoryId')
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
export const getRelatedPostsBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const limit = parseInt(req.query.limit, 10) || 10;
        const post = await PostNewsModel.findOne({ slug });
        if (!post) {
            return res.status(404).json({ code: 1, message: "Bài viết không tồn tại" });
        }
        const isActiveCategory = await isNewsCategoryActive(post.categoryId);
        if (!isActiveCategory) {
            return res.status(404).json({ code: 1, message: "Danh mục của bài viết đã bị vô hiệu hóa" });
        }
        const relatedPosts = await PostNewsModel.find({
            categoryId: new mongoose.Types.ObjectId(post.categoryId),
            slug: { $ne: slug },
            isActive: true,
        })
            .populate('categoryId')
            .limit(limit)
            .sort({ createdAt: -1 });
        return res.json({
            code: 0,
            data: relatedPosts.map(toPostNewsDTO),
            message: 'Success'
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const updateView = async (req, res) => {
    try {
        const { slug } = req.params;
        const post = await PostNewsModel.findOneAndUpdate({ slug, isActive: true }, { $inc: { views: 1 } }, { new: true });
        if (!post)
            return res.status(404).json({ code: 1, message: "Bài viết không tồn tại" });
        return res.json({ code: 0, data: { views: post.views }, message: "Cập nhật lượt xem thành công" });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
export const getAllPostsPagination = async (req, res) => {
    var _a;
    try {
        const page = parseInt(req.query.page, 10) || 1;
        let limit = parseInt(req.query.limit, 10) || 10;
        const search = req.query.search || "";
        const skip = (page - 1) * limit;
        const pipeline = [
            { $match: { isActive: true } },
            {
                $lookup: {
                    from: "post_categories",
                    localField: "categoryId",
                    foreignField: "_id",
                    as: "category"
                }
            },
            { $unwind: { path: "$category", preserveNullAndEmptyArrays: false } },
            { $match: { "category.isActive": true } },
            { $addFields: { categoryName: "$category.categoryName" } },
        ];
        if (search) {
            pipeline.push({
                $match: {
                    $or: [
                        { title: { $regex: search, $options: "i" } },
                        { summaryContent: { $regex: search, $options: "i" } }
                    ]
                }
            });
        }
        pipeline.push({ $sort: { createdAt: -1 } });
        const countPipeline = [...pipeline, { $count: "total" }];
        const totalResult = await PostNewsModel.aggregate(countPipeline);
        const total = ((_a = totalResult[0]) === null || _a === void 0 ? void 0 : _a.total) || 0;
        // 7. Skip & limit
        pipeline.push({ $skip: skip }, { $limit: limit });
        pipeline.push({ $project: { category: 0 } });
        const posts = await PostNewsModel.aggregate(pipeline);
        const totalPages = Math.ceil(total / limit);
        return res.json({
            code: 0,
            data: posts.map(toPostNewsDTO),
            pagination: { page, limit, total, totalPages },
            message: "Success"
        });
    }
    catch (err) {
        return res.status(500).json({ code: 1, message: err.message });
    }
};
//# sourceMappingURL=post-news.controller.js.map