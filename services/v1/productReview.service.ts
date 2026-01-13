import { API_ENDPOINTS } from "@/services/const/api.const";
import {
  type ProductReviewPaginationDTO,
  type ProductReviewDTO,
  type SubmitProductReviewBody,
  type ProductReviewWithProductDTO,
  paginationReviewError,
  type ProductReviewWithUserDTO,
  type ReviewStatus,
} from "@/server/types/dto/v1/product-review.dto";
import { apiError, type ApiResponse } from "@/server/types/common/api-response";
import { apiClient } from "../http/apiClient";

export const productReviewAPI = {
  getById: async (id: string): Promise<ApiResponse<ProductReviewWithProductDTO>> => {
    try {
      return await apiClient().get<ApiResponse<ProductReviewWithProductDTO>>(
        API_ENDPOINTS.PRODUCT_REVIEWS.GET_BY_ID(id)
      );
    } catch (err: any) {
      console.error(`Error fetching product review with ID ${id}:`, err);
      return apiError<ProductReviewWithProductDTO>(err)
    }
  },

  submitReview: async (bodyData: SubmitProductReviewBody): Promise<ApiResponse<ProductReviewDTO>> => {
    try {
      return await apiClient().put<ApiResponse<ProductReviewDTO>>(
        API_ENDPOINTS.PRODUCT_REVIEWS.SUBMIT,
        bodyData
      );
    } catch (err: any) {
      console.error("Error submitting product review:", err);
      return apiError<ProductReviewDTO>(err)
    }
  },

  getReviewsByUser: async (
    userId: string,
    status: ReviewStatus,
    page: number = 1,
    limit: number = 10
  ): Promise<ProductReviewPaginationDTO> => {
    try {
      const params = { status , page: page.toString(), limit: limit.toString() };
    return await apiClient().get<ProductReviewPaginationDTO>(
      API_ENDPOINTS.PRODUCT_REVIEWS.GET_BY_USER_PENDING(userId),params
    );
  } catch (err: any) {
      console.error(`Error fetching pending reviews for user`, err);
      return paginationReviewError<ProductReviewWithUserDTO>(
        page,
        limit,
        err
      )
    }
  },

  getReviewsByProduct: async (
    productId: string,
    page: number = 1,
    limit: number = 10
  ): Promise<ProductReviewPaginationDTO> => {
    try {
      const params = { page: page.toString(), limit: limit.toString() };
      return await apiClient().get<ProductReviewPaginationDTO>(
        API_ENDPOINTS.PRODUCT_REVIEWS.GET_BY_PRODUCT_ID(productId),
        params
      );
    } catch (err: any) {
      console.error("Error fetching reviews by product:", err);
      return paginationReviewError<ProductReviewWithUserDTO>(
        page,
        limit,
        err
      )
    }
  },
};
