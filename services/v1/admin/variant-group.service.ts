import { apiConfig } from '@/services/config/api.config';
import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin';
import type { 
  VariantGroupDTO, 
  CreateVariantGroupDTO, 
  UpdateVariantGroupDTO 
} from '@/server/types/dto/v1/product.dto';
import type { ApiResponse } from '@/server/types/common/api-response';

export const variantGroupAPI = {
  getAll: async (): Promise<ApiResponse<VariantGroupDTO[]>> => {
    try {
      const res = await fetch(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VARIANT_GROUPS.LIST_ALL}`,
        {
          credentials: 'include',
        }
      );
      const data = await res.json();
      return data;
    } catch (err: any) {
      console.error('Error fetching all variant groups:', err);
      return {
        code: 1,
        message: err.message ?? "Failed to fetch variant groups",
        data: []
      };
    }
  },

  getActive: async (): Promise<ApiResponse<VariantGroupDTO[]>> => {
    try {
      const res = await fetch(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VARIANT_GROUPS.LIST_ACTIVE}`,
        {
          credentials: 'include',
        }
      );
      const data = await res.json();
      return data;
    } catch (err: any) {
      console.error('Error fetching active variant groups:', err);
      return {
        code: 1,
        message: err.message ?? "Failed to fetch active variant groups",
        data: []
      };
    }
  },

  getById: async (id: string): Promise<ApiResponse<VariantGroupDTO>> => {
    try {
      const res = await fetch(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VARIANT_GROUPS.DETAIL.replace(':id', id)}`,
        {
          credentials: 'include',
        }
      );
      const data = await res.json();
      return data;
    } catch (err: any) {
      console.error('Error fetching variant group by ID:', err);
      return {
        code: 1,
        message: err.message ?? "Failed to fetch variant group",
        data: null as any
      };
    }
  },

  create: async (bodyData: CreateVariantGroupDTO): Promise<ApiResponse<VariantGroupDTO>> => {
    try {
      if (!bodyData.groupName || !bodyData.variants || bodyData.variants.length === 0) {
        return {
          code: 1,
          message: "Thiếu dữ liệu bắt buộc",
          data: null as any
        };
      }

      const response = await fetch(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VARIANT_GROUPS.CREATE}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(bodyData)
        }
      );

      const data = await response.json();
      return data;
    } catch (err: any) {
      console.error('Error creating variant group:', err);
      return {
        code: 1,
        message: err.message ?? "Failed to create variant group",
        data: null as any
      };
    }
  },

  update: async (id: string, bodyData: UpdateVariantGroupDTO): Promise<ApiResponse<VariantGroupDTO>> => {
    try {
      const response = await fetch(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VARIANT_GROUPS.UPDATE.replace(':id', id)}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(bodyData)
        }
      );

      const data = await response.json();
      return data;
    } catch (err: any) {
      console.error('Error updating variant group:', err);
      return {
        code: 1,
        message: err.message ?? "Failed to update variant group",
        data: null as any
      };
    }
  },

  delete: async (id: string): Promise<ApiResponse<void>> => {
    try {
      const response = await fetch(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VARIANT_GROUPS.DELETE.replace(':id', id)}`,
        {
          method: 'DELETE',
          credentials: 'include',
        }
      );

      const data = await response.json();
      return data;
    } catch (err: any) {
      console.error('Error deleting variant group:', err);
      return {
        code: 1,
        message: err.message ?? "Failed to delete variant group",
        data: null as any
      };
    }
  },

  toggleActive: async (id: string): Promise<ApiResponse<VariantGroupDTO>> => {
    try {
      const response = await fetch(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VARIANT_GROUPS.TOGGLE_ACTIVE.replace(':id', id)}`,
        {
          method: 'PATCH',
          credentials: 'include',
        }
      );

      const data = await response.json();
      return data;
    } catch (err: any) {
      console.error('Error toggling variant group active:', err);
      return {
        code: 1,
        message: err.message ?? "Failed to toggle variant group",
        data: null as any
      };
    }
  },

  getByType: async (type: string): Promise<ApiResponse<VariantGroupDTO[]>> => {
    try {
      const res = await fetch(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.VARIANT_GROUPS.BY_TYPE.replace(':type', type)}`,
        {
          credentials: 'include',
        }
      );
      const data = await res.json();
      return data;
    } catch (err: any) {
      console.error('Error fetching variant groups by type:', err);
      return {
        code: 1,
        message: err.message ?? "Failed to fetch variant groups by type",
        data: []
      };
    }
  },
};