import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin'
import type { ApiResponse } from '@/server/types/common/api-response'
import type { 
  TranslationDTO, 
  TranslationCreateDTO, 
  TranslationUpdateDTO, 
  TranslationPaginationDTO
} from '@/server/types/dto/v1/itranslation.dto';

export const iTranslationAPI = {
  getTranslations: async (page: number, limit: number, search: string = '') => {
    try {
      const url = `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.TRANSLATION.GET}`
        + `?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`

      const response = await fetch(url, {
        credentials: 'include',
      });

      return await response.json() as TranslationPaginationDTO;

    } catch (err: any) {
      console.error("API getTranslations error:", err)
      return { code: 1,
        message: err.message,
        data: [],
        pagination: {
          page: 1,
          limit: 10,
          total: 0,
          totalPages: 0
        }
      }
    }
  },


  getTranslationDetail: async (id: string) => {
    try {
      const response = await fetch(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.TRANSLATION.DETAIL}/${id}`,
        {
          credentials: "include",
        }
      );

      return await response.json() as ApiResponse<TranslationDTO>;
    } catch (err: any) {
      return { code: 1, message: err.message, data: null };
    }
  },

  createTranslation: async (payload: TranslationCreateDTO) => {
    try {
      const res = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.TRANSLATION.CREATE}`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });
      return await res.json() as ApiResponse<TranslationDTO>;
    } catch (err) {
      console.error(`Error create`, err)
      throw err
    }
  },

  updateTranslation: async (id: string, payload: TranslationUpdateDTO) => {
    try {
    const res = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.TRANSLATION.UPDATE}/${id}`, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    });
    return await res.json() as ApiResponse<TranslationDTO>;
    } catch (err) {
      console.error(`Error update with ID ${id}:`, err)
      throw err
    }
  },

  deleteTranslation: async (id: string) => {
    try {
      const res = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.TRANSLATION.DELETE}/${id}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      return await res.json();
    } catch (err) {
      console.error(`Error deleting with ID ${id}:`, err)
      throw err
    }
  }
};
