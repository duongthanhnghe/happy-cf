import { apiAdmin } from "@/services/http/apiAdmin";
import { API_ENDPOINTS_ADMIN } from "@/services/const/api-endpoints-admin";
import type {
  CreateFlashSaleBody,
  FlashSaleDTO,
  FlashSalePaginationDTO,
  UpdateFlashSaleBody,
} from "@/server/types/dto/v1/flash-sale.dto";
import type { ApiResponse } from "@/server/types/common/api-response";
import { apiError } from "@/server/types/common/api-response";
import { paginationError } from "@/server/types/common/pagination.dto";

export const flashSalesAPI = {
  getAll: async (
    page = 1,
    limit = 10,
    filters?: {
      name?: string;
      isActive?: boolean;
      fromDate?: string;
      toDate?: string;
    }
  ): Promise<FlashSalePaginationDTO> => {
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      });

      if (filters?.name) params.append("name", filters.name);
      if (filters?.isActive !== undefined)
        params.append("isActive", String(filters.isActive));
      if (filters?.fromDate) params.append("fromDate", filters.fromDate);
      if (filters?.toDate) params.append("toDate", filters.toDate);

      const url = `${API_ENDPOINTS_ADMIN.FLASH_SALES.LIST}?${params.toString()}`;
      return await apiAdmin().get<FlashSalePaginationDTO>(url);
    } catch (err: any) {
      console.error("Error fetching flash sales:", err);
      return paginationError<FlashSaleDTO>(page, limit, err);
    }
  },

  getDetail: async (id: string): Promise<ApiResponse<FlashSaleDTO>> => {
    try {
      return await apiAdmin().get<ApiResponse<FlashSaleDTO>>(
        API_ENDPOINTS_ADMIN.FLASH_SALES.GET_BY_ID(id)
      );
    } catch (err: any) {
      return apiError<FlashSaleDTO>(err);
    }
  },

  create: async (body: Partial<CreateFlashSaleBody>): Promise<ApiResponse<FlashSaleDTO>> => {
    try {
      return await apiAdmin().post<ApiResponse<FlashSaleDTO>>(
        API_ENDPOINTS_ADMIN.FLASH_SALES.CREATE,
        body
      );
    } catch (err: any) {
      return apiError<FlashSaleDTO>(err);
    }
  },

  update: async (
    id: string,
    body: Partial<UpdateFlashSaleBody>
  ): Promise<ApiResponse<FlashSaleDTO>> => {
    try {
      return await apiAdmin().put<ApiResponse<FlashSaleDTO>>(
        API_ENDPOINTS_ADMIN.FLASH_SALES.UPDATE(id),
        body
      );
    } catch (err: any) {
      return apiError<FlashSaleDTO>(err);
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      return await apiAdmin().delete<ApiResponse<null>>(
        API_ENDPOINTS_ADMIN.FLASH_SALES.DELETE(id)
      );
    } catch (err: any) {
      return apiError<null>(err);
    }
  },

  toggleActive: async (id: string): Promise<ApiResponse<FlashSaleDTO>> => {
    try {
      return await apiAdmin().patch<ApiResponse<FlashSaleDTO>>(
        API_ENDPOINTS_ADMIN.FLASH_SALES.TOGGLE_ACTIVE(id)
      );
    } catch (err: any) {
      console.error(`Error toggling flash sale ${id}:`, err);
      return apiError<FlashSaleDTO>(err);
    }
  },
};