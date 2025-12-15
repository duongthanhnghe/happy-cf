import { ProductReviewEntity } from "../../../models/v1/product-review.entity.js";
import { toProductReviewDTO, toProductReviewListDTO } from "../../../mappers/v1/product-review.mapper.js";
import { UserModel } from "../../../models/v1/user.entity.js";
export const getAllProductReviews = async (req, res) => {
    try {
        let { page = 1, limit = 10, fromDate, toDate, search, rating, status, } = req.query;
        const numPage = Number(page);
        const numLimit = Number(limit);
        const filter = {};
        if (fromDate || toDate) {
            filter.createdAt = {};
            if (fromDate)
                filter.createdAt.$gte = new Date(fromDate);
            if (toDate)
                filter.createdAt.$lte = new Date(toDate);
        }
        if (rating !== undefined) {
            filter.rating = Number(rating);
        }
        if (status) {
            filter.status = status;
        }
        if (search) {
            const users = await UserModel.find({
                fullname: { $regex: search, $options: "i" },
            }).select("_id");
            const userIds = users.map(u => u._id);
            filter.$or = [
                ...(userIds.length > 0
                    ? [{ userId: { $in: userIds } }]
                    : []),
                { comment: { $regex: search, $options: "i" } },
            ];
        }
        if (numLimit === -1) {
            const reviews = await ProductReviewEntity.find(filter)
                .sort({ createdAt: -1 })
                .populate("userId")
                .populate("productId");
            return res.json({
                code: 0,
                data: toProductReviewListDTO(reviews),
                pagination: {
                    page: 1,
                    limit: reviews.length,
                    totalPages: 1,
                    total: reviews.length,
                },
            });
        }
        const options = {
            page: numPage,
            limit: numLimit,
            sort: { createdAt: -1 },
            populate: [
                { path: "userId", model: "User" },
                { path: "productId", model: "Product" },
            ],
        };
        const result = await ProductReviewEntity.paginate(filter, options);
        return res.json({
            code: 0,
            data: toProductReviewListDTO(result.docs),
            pagination: {
                page: result.page,
                limit: result.limit,
                totalPages: result.totalPages,
                total: result.totalDocs,
            },
        });
    }
    catch (error) {
        console.error("🔥 Lỗi chi tiết getAllProductReviews:", error);
        return res.status(500).json({
            code: 1,
            message: "Lỗi lấy danh sách đánh giá",
        });
    }
};
export const getProductReviewById = async (req, res) => {
    try {
        const review = await ProductReviewEntity.findById(req.params.id)
            .populate("orderId")
            .populate("userId")
            .populate("productId");
        if (!review) {
            return res.status(404).json({ code: 1, message: "Đánh giá không tồn tại" });
        }
        return res.json({ code: 0, data: toProductReviewDTO(review) });
    }
    catch (error) {
        return res.status(500).json({ code: 1, message: "Lỗi lấy đánh giá", error });
    }
};
export const updateProductReviewStatus = async (req, res) => {
    try {
        const { id, status } = req.body;
        if (!id || !status) {
            return res.status(400).json({ code: 1, message: "Thiếu id hoặc status" });
        }
        const review = await ProductReviewEntity.findById(id);
        if (!review) {
            return res.status(404).json({ code: 1, message: "Đánh giá không tồn tại" });
        }
        review.status = status;
        await review.save();
        return res.json({
            code: 0,
            message: "Cập nhật trạng thái đánh giá thành công",
            data: toProductReviewDTO(review),
        });
    }
    catch (error) {
        return res.status(500).json({ code: 1, message: "Lỗi cập nhật trạng thái đánh giá", error });
    }
};
export const deleteProductReview = async (req, res) => {
    try {
        const deleted = await ProductReviewEntity.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ code: 1, message: "Đánh giá không tồn tại" });
        }
        return res.json({ code: 0, message: "Xóa đánh giá thành công" });
    }
    catch (error) {
        return res.status(500).json({ code: 1, message: "Lỗi xóa đánh giá", error });
    }
};
//# sourceMappingURL=product-review.controller.js.map