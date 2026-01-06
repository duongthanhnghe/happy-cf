import { API_ENDPOINTS_ADMIN } from "@/services/const/api-endpoints-admin"
import { apiAdmin } from "@/services/http/apiAdmin"
import type { ApiResponse } from "@server/types/common/api-response"
import type {
  ProductReviewPaginationDTO,
  ProductReviewDTO,
  ProductReviewWithProductDTO,
} from "@/server/types/dto/v1/product-review.dto"

export const productReviewAPI = {
  getAll: async (
    page = 1,
    limit = 10,
    fromDate?: string,
    toDate?: string,
    search?: string,
    rating?: string,
    status?: string,
  ): Promise<ProductReviewPaginationDTO> => {
    try {
      const params: Record<string, any> = { page, limit }
      if (fromDate) params.fromDate = fromDate
      if (toDate) params.toDate = toDate
      if (search) params.search = search
      if (rating) params.rating = rating
      if (status) params.status = status

      return await apiAdmin().get<ProductReviewPaginationDTO>(
        API_ENDPOINTS_ADMIN.PRODUCT_REVIEWS.LIST,
        params
      )
    } catch (err: any) {
      console.error("Error fetching product reviews:", err)
      return {
        code: 1,
        message: err.message ?? "Failed to fetch product reviews",
        data: [],
        pagination: {
          total: 0,
          totalPages: 0,
          page,
          limit,
        },
        summary: {
          averageRating: 0,
          totalReviews: 0,
          ratingsBreakdown: {
            1: 0,
            2: 0,
            3: 0,
            4: 0,
            5: 0,
          },
        },
      }
    }
  },

  getById: async (id: string): Promise<ApiResponse<ProductReviewWithProductDTO>> => {
    try {
      return await apiAdmin().get<ApiResponse<ProductReviewWithProductDTO>>(
        API_ENDPOINTS_ADMIN.PRODUCT_REVIEWS.GET_BY_ID(id)
      )
    } catch (err: any) {
      console.error(`Error fetching product review with ID ${id}:`, err)
      return {
        code: 1,
        message: err.message ?? `Failed to fetch product review with ID ${id}`,
        data: undefined as any,
      }
    }
  },

  updateStatus: async (id: string, status: string): Promise<ApiResponse<ProductReviewDTO>> => {
    try {
      return await apiAdmin().put<ApiResponse<ProductReviewDTO>>(
        API_ENDPOINTS_ADMIN.PRODUCT_REVIEWS.UPDATE_STATUS,
        { id, status }
      )
    } catch (err: any) {
      console.error("Error updating product review status:", err)
      return {
        code: 1,
        message: err.message ?? "Unexpected error while updating product review status",
        data: undefined as any,
      }
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      return await apiAdmin().delete<ApiResponse<null>>(
        API_ENDPOINTS_ADMIN.PRODUCT_REVIEWS.DELETE(id)
      )
    } catch (err: any) {
      console.error(`Error deleting product review with ID ${id}:`, err)
      return {
        code: 1,
        message: err.message ?? `Unexpected error while deleting product review with ID ${id}`,
        data: null,
      }
    }
  },
}

// import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin'
// import type { ProductReviewPaginationDTO, ProductReviewDTO, SubmitProductReviewBody, ProductReviewWithProductDTO } from '@/server/types/dto/v1/product-review.dto';
// import type { ApiResponse } from '@server/types/common/api-response';

// export const productReviewAPI = {
//   getAll: async (
//     page = 1,
//     limit = 10,
//     fromDate: string,
//     toDate: string,
//     search: string,
//     rating: string | null,
//     status: string | null,
//   ): Promise<ProductReviewPaginationDTO> => {
//     try {

//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//       });

//       if (fromDate) params.append("fromDate", fromDate);
//       if (toDate) params.append("toDate", toDate);
//       if (search) params.append("search", search);
//       if (rating) params.append("rating", rating);
//       if (status) params.append("status", status);

//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCT_REVIEWS.LIST}?${params}`);
//       const data = await response.json();
//       return data;
//     } catch (err) {
//       console.error("Error fetching product reviews:", err);
//       return {
//         code: 1,
//         message: "Failed to fetch orders",
//         data: [],
//         pagination: {
//           total: 0,
//           totalPages: 0,
//           page: 1,
//           limit,
//         },
//         summary: {
//           averageRating: 0,
//           totalReviews: 0,
//           ratingsBreakdown: {
//             1: 0,
//             2: 0,
//             3: 0,
//             4: 0,
//             5: 0,
//           },
//         }
//       }
//     }
//   },

//   getById: async (id: string): Promise<ApiResponse<ProductReviewWithProductDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCT_REVIEWS.GET_BY_ID(id)}`);
//       if (!response.ok) {
//         throw new Error(`Failed to fetch product review with ID ${id}`);
//       }
//       const data = await response.json();
//       return data;
//     } catch (err) {
//       console.error(`Error fetching product review with ID ${id}:`, err);
//       return {
//         code: 1,
//         message: `Failed to fetch product review with ID ${id}`,
//         data: undefined as any,
//       };
//     }
//   },

//   updateStatus: async (id: string, status: string): Promise<ApiResponse<ProductReviewDTO>> => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCT_REVIEWS.UPDATE_STATUS}`, {
//         method: 'PUT',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({id,status}),
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         return {
//           code: 1,
//           message: errorData.message || 'Failed to update product review status',
//           data: undefined as any,
//         };
//       }

//       const data: ApiResponse<ProductReviewDTO> = await response.json();
//       return data;
//     } catch (err) {
//       console.error('Error updating product review status:', err);
//       return {
//         code: 1,
//         message: 'Unexpected error while updating product review status',
//         data: undefined as any,
//       };
//     }
//   },

//   delete: async (id: string): Promise<ApiResponse<null>> => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.PRODUCT_REVIEWS.DELETE(id)}`, {
//         method: 'DELETE',
//       });

//       if (!response.ok) {
//         const errorData = await response.json();
//         return {
//           code: 1,
//           message: errorData.message || `Failed to delete product review with ID ${id}`,
//           data: null,
//         };
//       }

//       return {
//         code: 0,
//         message: 'Product review deleted successfully',
//         data: null,
//       };
//     } catch (err) {
//       console.error(`Error deleting product review with ID ${id}:`, err);
//       return {
//         code: 1,
//         message: `Unexpected error while deleting product review with ID ${id}`,
//         data: null,
//       };
//     }
//   },
// };