import { apiConfig } from '@/config/api.config';
import { API_ENDPOINTS } from '@/const/api.const'
import type { ProductReviewPaginationDTO, ProductReviewDTO, SubmitProductReviewBody, ProductReviewWithProductDTO } from '@server/types/dto/product-review.dto';
import type { ApiResponse } from '@server/types/common/api-response';

export const productReviewAPI = {
  getAll: async (
    page = 1,
    limit = 10
  ): Promise<ProductReviewPaginationDTO> => {
    try {
      const response = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCT_REVIEWS.LIST}?page=${page}&limit=${limit}`
      );
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error fetching product reviews:", err);
      return {
        code: 1,
        message: "Failed to fetch orders",
        data: [],
        pagination: {
          total: 0,
          totalPages: 0,
          page: 1,
          limit,
        },
      }
    }
  },

  getById: async (id: string): Promise<ApiResponse<ProductReviewWithProductDTO>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCT_REVIEWS.GET_BY_ID(id)}`);
      if (!response.ok) {
        throw new Error(`Failed to fetch product review with ID ${id}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(`Error fetching product review with ID ${id}:`, err);
      return {
        code: 1,
        message: `Failed to fetch product review with ID ${id}`,
        data: undefined as any,
      };
    }
  },


  updateStatus: async (id: string, status: string): Promise<ApiResponse<ProductReviewDTO>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCT_REVIEWS.UPDATE_STATUS}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({id,status}),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          code: 1,
          message: errorData.message || 'Failed to update product review status',
          data: undefined as any,
        };
      }

      const data: ApiResponse<ProductReviewDTO> = await response.json();
      return data;
    } catch (err) {
      console.error('Error updating product review status:', err);
      return {
        code: 1,
        message: 'Unexpected error while updating product review status',
        data: undefined as any,
      };
    }
  },

  /**
   * Xóa một đánh giá sản phẩm theo ID
   */
  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCT_REVIEWS.DELETE(id)}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          code: 1,
          message: errorData.message || `Failed to delete product review with ID ${id}`,
          data: null,
        };
      }

      return {
        code: 0,
        message: 'Product review deleted successfully',
        data: null,
      };
    } catch (err) {
      console.error(`Error deleting product review with ID ${id}:`, err);
      return {
        code: 1,
        message: `Unexpected error while deleting product review with ID ${id}`,
        data: null,
      };
    }
  },

  submitReview: async (bodyData: SubmitProductReviewBody): Promise<ApiResponse<ProductReviewDTO>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCT_REVIEWS.SUBMIT}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        return {
          code: 1,
          message: errorData.message || "Failed to submit review",
          data: undefined as any,
        };
      }

      const data: ApiResponse<ProductReviewDTO> = await response.json();
      return data;
    } catch (err) {
      console.error("Error submitting product review:", err);
      return {
        code: 1,
        message: "Unexpected error while submitting product review",
        data: undefined as any,
      };
    }
  },

  getReviewsByUser: async (userId: string, status: string, page: number = 1,
    limit: number = 10): Promise<ProductReviewPaginationDTO> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.PRODUCT_REVIEWS.GET_BY_USER_PENDING(userId)}?status=${status}&page=${page}&limit=${limit}`);
      const data = await response.json();
      return data;
    } catch (err) {
      console.error(`Error fetching pending reviews for user ${userId}:`, err);
      return {
        code: 1,
        message: "Failed to fetch orders",
        data: [],
        pagination: {
          total: 0,
          totalPages: 0,
          page: 1,
          limit,
        },
      }
    }
  },
};