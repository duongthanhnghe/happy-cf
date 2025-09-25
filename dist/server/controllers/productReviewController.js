import { ProductReviewEntity } from "../models/ProductReviewEntity.js";
import { toProductReviewDTO, toProductReviewListDTO } from "../mappers/productReviewMapper.js";
export const getAllProductReviews = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;
        const numPage = Number(page);
        let numLimit = Number(limit);
        // Trường hợp lấy tất cả (limit = -1)
        if (numLimit === -1) {
            const reviews = await ProductReviewEntity.find({})
                .sort({ createdAt: -1 })
                // .populate("orderId")
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
                // { path: "orderId", model: "Order" },
                { path: "userId", model: "User" },
                { path: "productId", model: "Product" },
            ],
        };
        const result = await ProductReviewEntity.paginate({}, options);
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
        return res.status(500).json({
            code: 1,
            message: "Lỗi lấy danh sách đánh giá",
            error,
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
export const submitProductReview = async (req, res) => {
    try {
        const { reviewId, rating, comment, images } = req.body;
        if (!reviewId || !rating) {
            return res.status(400).json({ code: 1, message: "Thiếu reviewId hoặc rating" });
        }
        const review = await ProductReviewEntity.findById(reviewId);
        if (!review) {
            return res.status(404).json({ code: 1, message: "Đánh giá không tồn tại" });
        }
        review.rating = rating;
        review.comment = comment || null;
        review.images = images || [];
        review.status = "approved"; // Chuyển trạng thái thành approved
        await review.save();
        return res.json({ code: 0, message: "Gửi đánh giá thành công", data: toProductReviewDTO(review) });
    }
    catch (error) {
        console.error("Lỗi submitProductReview:", error);
        return res.status(500).json({ code: 1, message: "Lỗi gửi đánh giá", error });
    }
};
export const getReviewsByUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, page = 1, limit = 10 } = req.query; // Lấy status, page và limit từ query string
        if (!userId) {
            return res.status(400).json({ code: 1, message: "Thiếu userId" });
        }
        if (!status) {
            return res.status(400).json({ code: 1, message: "Thiếu status" });
        }
        const numPage = Number(page);
        const numLimit = Number(limit);
        const query = {
            userId,
            status, // Sử dụng status từ query string
        };
        // Nếu limit = -1, trả về toàn bộ dữ liệu không phân trang
        if (numLimit === -1) {
            const reviews = await ProductReviewEntity.find(query)
                // .populate("orderId")
                .populate("productId")
                .sort({ createdAt: -1 });
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
        // Phân trang
        const options = {
            page: numPage,
            limit: numLimit,
            sort: { createdAt: -1 },
            populate: [
                // { path: "orderId", model: "Order" },
                { path: "productId", model: "Product" },
            ],
        };
        const result = await ProductReviewEntity.paginate(query, options);
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
        console.error("Lỗi getReviewsByUser:", error);
        return res.status(500).json({ code: 1, message: "Lỗi lấy danh sách đánh giá", error });
    }
};
//# sourceMappingURL=productReviewController.js.map