import type { Request, Response } from "express";
import { ProductReviewEntity } from "../../models/v1/product-review.entity";
import { toProductReviewDTO, toProductReviewListDTO } from "../../mappers/v1/product-review.mapper";
import { ProductEntity } from "../../models/v1/product.entity";

export const getProductReviewById = async (req: Request, res: Response) => {
  try {
    const review = await ProductReviewEntity.findById(req.params.id)
      .populate("orderId")
      .populate("userId")
      .populate("productId");

    if (!review) {
      return res.status(404).json({ code: 1, message: "Đánh giá không tồn tại" });
    }

    return res.json({ code: 0, data: toProductReviewDTO(review) });
  } catch (error) {
    return res.status(500).json({ code: 1, message: "Lỗi lấy đánh giá", error });
  }
};

export const submitProductReview = async (req: Request, res: Response) => {
  try {
    const { reviewId, rating, comment, images } = req.body;

    const review = await ProductReviewEntity.findById(reviewId);
    if (!review) {
      return res.status(404).json({ code: 1, message: "Đánh giá không tồn tại" });
    }

    review.rating = rating;
    review.comment = comment || null;
    review.images = images || [];
    review.status = "approved";
    await review.save();

    return res.json({ code: 0, message: "Gửi đánh giá thành công", data: toProductReviewDTO(review) });
  } catch (error) {
    console.error("Lỗi submitProductReview:", error);
    return res.status(500).json({ code: 1, message: "Lỗi gửi đánh giá", error });
  }
};

export const getReviewsByUser = async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    const { status, page = 1, limit = 10 } = req.query;

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
      status,
    };

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
  } catch (error) {
    console.error("Lỗi getReviewsByUser:", error);
    return res.status(500).json({ code: 1, message: "Lỗi lấy danh sách đánh giá", error });
  }
};

export const getReviewsByProduct = async (req: Request, res: Response) => {
  try {
    const { productId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    if (!productId) {
      return res.status(400).json({ code: 1, message: "Thiếu productId" });
    }

    const product = await ProductEntity.findById(productId);
    if (!product) {
      return res.status(404).json({ code: 1, message: "Sản phẩm không tồn tại" });
    }

    const numPage = Number(page);
    const numLimit = Number(limit);
    const query = { productId: product._id, status: "approved" };

    // --- Summary (average rating + count theo sao) ---
    const summaryAgg = await ProductReviewEntity.aggregate([
      { $match: query },
      {
        $group: {
          _id: "$rating",
          count: { $sum: 1 },
        },
      },
    ]);

    // tổng số review
    const totalReviews = summaryAgg.reduce((acc, cur) => acc + cur.count, 0);

    // tính average
    const sumRatings = summaryAgg.reduce(
      (acc, cur) => acc + cur._id * cur.count,
      0
    );
    const averageRating =
      totalReviews > 0 ? parseFloat((sumRatings / totalReviews).toFixed(1)) : 0;

    // mapping thành {1: x, 2: y, 3: z...}
    const ratingsBreakdown: Record<number, number> = {};
    for (let i = 1; i <= 5; i++) {
      const found = summaryAgg.find((s) => s._id === i);
      ratingsBreakdown[i] = found ? found.count : 0;
    }

    // --- Lấy data review ---
    if (numLimit === -1) {
      const reviews = await ProductReviewEntity.find(query)
        .populate("userId")
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
        summary: {
          averageRating,
          totalReviews,
          ratingsBreakdown,
        },
      });
    }

    // có phân trang
    const options = {
      page: numPage,
      limit: numLimit,
      sort: { createdAt: -1 },
      populate: [{ path: "userId", model: "User" }],
    };

    const result = await (ProductReviewEntity as any).paginate(query, options);

    return res.json({
      code: 0,
      data: toProductReviewListDTO(result.docs),
      pagination: {
        page: result.page,
        limit: result.limit,
        totalPages: result.totalPages,
        total: result.totalDocs,
      },
      summary: {
        averageRating,
        totalReviews,
        ratingsBreakdown,
      },
    });
  } catch (error) {
    console.error("Lỗi getReviewsByProduct:", error);
    return res
      .status(500)
      .json({ code: 1, message: "Lỗi lấy danh sách đánh giá", error });
  }
};
