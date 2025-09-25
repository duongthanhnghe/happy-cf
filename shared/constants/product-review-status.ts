import type { ReviewStatus } from "@/server/types/dto/product-review.dto"

export interface StatusItem {
  name: string;
  status: ReviewStatus;
}

export const PRODUCT_REVIEW_STATUS: Record<ReviewStatus, StatusItem> = {
  pending: {
    name: "Chưa đánh giá",
    status: "pending",
  },
  approved: {
    name: "Đã đánh giá",
    status: "approved",
  },
  rejected: {
    name: "Bị ẩn",
    status: "rejected",
  },
};

export const ARRAY_RATING = [
    { text: 'Tất cả', value: 0 },
    { text: '1 sao', value: 1 },
    { text: '2 sao', value: 2 },
    { text: '3 sao', value: 3 },
    { text: '4 sao', value: 4 },
    { text: '5 sao', value: 5 }
  ]