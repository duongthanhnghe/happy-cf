import { PRODUCT_REVIEW_STATUS } from "../../types/dto/v1/product-review.dto";
import type { CreateProductReviewInput } from "../../types/dto/v1/product-review.dto";

export const createProductReviewEntity = ({
  orderId,
  userId,
  productId,
}: CreateProductReviewInput) => {
  return {
    orderId,
    userId,
    productId,
    rating: 0,
    comment: "",
    images: [],
    status: PRODUCT_REVIEW_STATUS.PENDING,
  };
};
