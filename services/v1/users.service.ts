import { API_ENDPOINTS } from "@/services/const/api.const";
import { apiClient } from "../http/apiClient";
import type { ApiResponse } from "@server/types/common/api-response";
import type { SearchKeywordDTO } from '@/server/types/dto/v1/search-keyword.dto'
import type { MembershipLevels } from '@/server/types/dto/v1/user.dto'
import { apiError } from "@/server/types/common/api-response"

export const usersAPI = {
  getTopSearchKeyword: async (limit: number): Promise<ApiResponse<SearchKeywordDTO[]>> => {
    try {
      return await apiClient().get<ApiResponse<SearchKeywordDTO[]>>(
        API_ENDPOINTS.USERS.LIST_SEARCH_KEYWORD(limit)
      );
    } catch (err: any) {
      console.error("Error fetching top search keywords:", err);
      return apiError<SearchKeywordDTO[]>(err)
    }
  },
  logSearchKeyword: async (keyword: string): Promise<ApiResponse<null>> => {
    try {
      return await apiClient().post<ApiResponse<null>>(
        API_ENDPOINTS.USERS.LOG_SEARCH_KEYWORD,
        { keyword }
      );
    } catch (err: any) {
      console.error("Error logging search keyword:", err);
      return apiError<null>(err)
    }
  },
  getAllMembershipLevel: async (): Promise<ApiResponse<MembershipLevels[]>> => {
    try {
      return await apiClient().get<ApiResponse<MembershipLevels[]>>(API_ENDPOINTS.USERS.LIST_MEMBERSHIP_LEVEL);
    } catch (err: any) {
      console.error("Error fetching all membership levels:", err);
      return apiError<MembershipLevels[]>(err)
    }
  },
  getMembershipLevelById: async (id: string): Promise<ApiResponse<MembershipLevels>> => {
    try {
      return await apiClient().get<ApiResponse<MembershipLevels>>(API_ENDPOINTS.USERS.GET_MEMBERSHIP_LEVEL_BY_ID(id));
    } catch (err: any) {
      console.error(`Error fetching membership level ID ${id}:`, err);
      return apiError<MembershipLevels>(err)
    }
  },
};