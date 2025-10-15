export const PRODUCT_REVIEW_STATUS = {
    PENDING: "pending",
    APPROVED: "approved",
    REJECTED: "rejected",
};
export const ProductReviewStatusText = {
    [PRODUCT_REVIEW_STATUS.PENDING]: "Chưa đánh giá",
    [PRODUCT_REVIEW_STATUS.APPROVED]: "Đã đánh giá",
    [PRODUCT_REVIEW_STATUS.REJECTED]: "Đã bị ẩn",
};
export const ProductReviewStatusColor = {
    [PRODUCT_REVIEW_STATUS.PENDING]: "orange",
    [PRODUCT_REVIEW_STATUS.APPROVED]: "green",
    [PRODUCT_REVIEW_STATUS.REJECTED]: "red",
};
//# sourceMappingURL=product-review.dto.js.map