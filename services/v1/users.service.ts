import { API_ENDPOINTS } from "@/services/const/api.const";
import { apiClient } from "../http/apiClient";
import type { ApiResponse } from "@server/types/common/api-response";

export const usersAPI = {
  getTopSearchKeyword: async (limit: number): Promise<ApiResponse<any>> => {
    try {
      return await apiClient().get<ApiResponse<any>>(
        API_ENDPOINTS.USERS.LIST_SEARCH_KEYWORD(limit)
      );
    } catch (err: any) {
      console.error("Error fetching top search keywords:", err);
      return {
        code: 1,
        message: err.message || "Failed to fetch top search keywords",
        data: [],
      };
    }
  },
  logSearchKeyword: async (keyword: string): Promise<ApiResponse<any>> => {
    try {
      return await apiClient().post<ApiResponse<any>>(
        API_ENDPOINTS.USERS.LOG_SEARCH_KEYWORD,
        { keyword }
      );
    } catch (err: any) {
      console.error("Error logging search keyword:", err);
      return {
        code: 1,
        message: err.message || "Failed to log search keyword",
        data: null,
      };
    }
  },
  getAllMembershipLevel: async (): Promise<ApiResponse<any[]>> => {
    try {
      return await apiClient().get<ApiResponse<any[]>>(API_ENDPOINTS.USERS.LIST_MEMBERSHIP_LEVEL);
    } catch (err: any) {
      console.error("Error fetching all membership levels:", err);
      return { code: 1, message: err.message ?? "Failed to fetch membership levels", data: [] };
    }
  },

  getMembershipLevelById: async (id: string): Promise<ApiResponse<any>> => {
    try {
      return await apiClient().get<ApiResponse<any>>(API_ENDPOINTS.USERS.GET_MEMBERSHIP_LEVEL_BY_ID(id));
    } catch (err: any) {
      console.error(`Error fetching membership level ID ${id}:`, err);
      return { code: 1, message: err.message ?? "Failed to fetch membership level", data: undefined as any };
    }
  },
};

// import { API_ENDPOINTS } from '@/services/const/api.const'

// export const usersAPI = {
//   getTopSearchKeyword: async (limit: number) => {
//   try {
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.USERS.LIST_SEARCH_KEYWORD(limit)}`)
//       const data = await response.json()
//       return data;
//     } catch (err) {
//       console.error('Error:', err)
//     }
//   },
//   logSearchKeyword: async (keyword: string) => {
//     try {
//       const res = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.USERS.LOG_SEARCH_KEYWORD}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ keyword }),
//       })

//       const result = await res.json()
//       return result
//     } catch (err) {
//       console.error('Error logging search keyword:', err)
//     }
//   },
// }