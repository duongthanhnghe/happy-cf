import { API_ENDPOINTS_ADMIN } from "@/services/const/api-endpoints-admin";
import { apiAdmin } from "@/services/http/apiAdmin";
import type { ApiResponse } from "@/server/types/common/api-response";
import type { TranslationDTO, TranslationCreateDTO, TranslationUpdateDTO, TranslationPaginationDTO } from "@/server/types/dto/v1/itranslation.dto";
import { apiError } from '@/server/types/common/api-response'
import { paginationError } from '@/server/types/common/pagination.dto'

export const iTranslationAPI = {
  getTranslations: async (page: number, limit: number, search: string = ''): Promise<TranslationPaginationDTO> => {
    try {
      const params = { page, limit, search };
      return await apiAdmin().get<TranslationPaginationDTO>(API_ENDPOINTS_ADMIN.TRANSLATION.GET, params);
    } catch (err: any) {
      console.error("API getTranslations error:", err);
      return paginationError<TranslationDTO>(page, limit, err)
    }
  },

  getTranslationDetail: async (id: string): Promise<ApiResponse<TranslationDTO>> => {
    try {
      return await apiAdmin().get<ApiResponse<TranslationDTO>>(`${API_ENDPOINTS_ADMIN.TRANSLATION.DETAIL}/${id}`);
    } catch (err: any) {
      console.error(`Error getting translation detail with ID ${id}:`, err);
      return apiError<TranslationDTO>(err)
    }
  },

  createTranslation: async (payload: TranslationCreateDTO): Promise<ApiResponse<TranslationDTO>> => {
    try {
      return await apiAdmin().post<ApiResponse<TranslationDTO>>(API_ENDPOINTS_ADMIN.TRANSLATION.CREATE, payload);
    } catch (err: any) {
      console.error("Error creating translation:", err);
      return apiError<TranslationDTO>(err)
    }
  },

  updateTranslation: async (id: string, payload: TranslationUpdateDTO): Promise<ApiResponse<TranslationDTO>> => {
    try {
      return await apiAdmin().put<ApiResponse<TranslationDTO>>(`${API_ENDPOINTS_ADMIN.TRANSLATION.UPDATE}/${id}`, payload);
    } catch (err: any) {
      console.error(`Error updating translation with ID ${id}:`, err);
      return apiError<TranslationDTO>(err)
    }
  },

  deleteTranslation: async (id: string): Promise<ApiResponse<null>> => {
    try {
      return await apiAdmin().delete<ApiResponse<null>>(`${API_ENDPOINTS_ADMIN.TRANSLATION.DELETE}/${id}`);
    } catch (err: any) {
      console.error(`Error deleting translation with ID ${id}:`, err);
      return apiError<null>(err)
    }
  },
};

// import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin'
// import type { ApiResponse } from '@/server/types/common/api-response'
// import type { 
//   TranslationDTO, 
//   TranslationCreateDTO, 
//   TranslationUpdateDTO, 
//   TranslationPaginationDTO
// } from '@/server/types/dto/v1/itranslation.dto';

// export const iTranslationAPI = {
//   getTranslations: async (page: number, limit: number, search: string = '') => {
//     try {
//       const url = `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.TRANSLATION.GET}`
//         + `?page=${page}&limit=${limit}&search=${encodeURIComponent(search)}`

//       const response = await fetch(url, {
//         credentials: 'include',
//       });

//       return await response.json() as TranslationPaginationDTO;

//     } catch (err: any) {
//       console.error("API getTranslations error:", err)
//       return { code: 1,
//         message: err.message,
//         data: [],
//         pagination: {
//           page: 1,
//           limit: 10,
//           total: 0,
//           totalPages: 0
//         }
//       }
//     }
//   },

//   getTranslationDetail: async (id: string) => {
//     try {
//       const response = await fetch(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.TRANSLATION.DETAIL}/${id}`,
//         {
//           credentials: "include",
//         }
//       );

//       return await response.json() as ApiResponse<TranslationDTO>;
//     } catch (err: any) {
//       return { code: 1, message: err.message, data: null };
//     }
//   },

//   createTranslation: async (payload: TranslationCreateDTO) => {
//     try {
//       const res = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.TRANSLATION.CREATE}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload)
//       });
//       return await res.json() as ApiResponse<TranslationDTO>;
//     } catch (err) {
//       console.error(`Error create`, err)
//       throw err
//     }
//   },

//   updateTranslation: async (id: string, payload: TranslationUpdateDTO) => {
//     try {
//     const res = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.TRANSLATION.UPDATE}/${id}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(payload)
//     });
//     return await res.json() as ApiResponse<TranslationDTO>;
//     } catch (err) {
//       console.error(`Error update with ID ${id}:`, err)
//       throw err
//     }
//   },

//   deleteTranslation: async (id: string) => {
//     try {
//       const res = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.TRANSLATION.DELETE}/${id}`, {
//         method: 'DELETE',
//       });
//       return await res.json();
//     } catch (err) {
//       console.error(`Error deleting with ID ${id}:`, err)
//       throw err
//     }
//   }
// };
