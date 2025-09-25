import { Types } from "mongoose";
import type { PaginationDTO } from '../common/pagination.dto'
import type { ProductDTO } from "../dto/product.dto"
import type { User } from "./user.dto"; 

export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export const PRODUCT_REVIEW_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
} as const;

export type ProductReviewStatus =
  typeof PRODUCT_REVIEW_STATUS[keyof typeof PRODUCT_REVIEW_STATUS];

export const ProductReviewStatusText: Record<ProductReviewStatus, string> = {
  [PRODUCT_REVIEW_STATUS.PENDING]: "Chưa đánh giá",
  [PRODUCT_REVIEW_STATUS.APPROVED]: "Đã đánh giá",
  [PRODUCT_REVIEW_STATUS.REJECTED]: "Đã bị ẩn",
};

export const ProductReviewStatusColor: Record<ProductReviewStatus, string> = {
  [PRODUCT_REVIEW_STATUS.PENDING]: "orange",
  [PRODUCT_REVIEW_STATUS.APPROVED]: "green",
  [PRODUCT_REVIEW_STATUS.REJECTED]: "red",
};

export interface ProductReviewDTO {
  id: string;
  orderId: string;
  userId: string | User;
  productId: string | ProductDTO;
  rating: number;
  comment: string | null;
  images: string[];
  status: ReviewStatus;
  statusText: string;
  statusColor: string;
  createdAt: string;
  updatedAt: string;
}

export interface SubmitProductReviewBody {
  reviewId: string;
  rating: number;
  comment?: string;
  images?: string[];
}

export interface CreateProductReviewBody {
  orderId: string;
  userId: string;
  productId: string;
  rating: number;
  comment?: string;
  images?: string[];
}

export interface UpdateProductReviewBody {
  id: string;
  status: ReviewStatus;
}

export interface ProductReviewWithUserDTO extends Omit<ProductReviewDTO, "userId"> {
  userId: User;
}

export interface ProductReviewWithProductDTO extends Omit<ProductReviewDTO, "productId"> {
  productId: ProductDTO;
}

export type ProductReviewPaginationDTO = PaginationDTO<ProductReviewWithUserDTO>