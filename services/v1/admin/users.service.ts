import { apiAdmin } from "@/services/http/apiAdmin";
import { API_ENDPOINTS_ADMIN } from "@/services/const/api-endpoints-admin";
import type { 
  User, 
  MembershipBenefitDTO, 
  CreateMembershipBenefit, 
  UpdateMembershipBenefit 
} from "@/server/types/dto/v1/user.dto";
import type { ApiResponse } from "@server/types/common/api-response";
import type { PaginationDTO } from "@server/types/common/pagination.dto";

export const usersAPI = {
  getDetailAccount: async (id: string): Promise<ApiResponse<User>> => {
    try {
      return await apiAdmin().get<ApiResponse<User>>(API_ENDPOINTS_ADMIN.USERS.GET_BY_ID(id));
    } catch (err: any) {
      console.error(`Error getting user detail with ID ${id}:`, err);
      return { code: 1, message: err.message ?? `Failed to fetch user with ID ${id}`, data: undefined as any };
    }
  },

  getAllUsers: async (
    page = 1,
    limit = 10,
    search?: string,
    membershipLevel?: string
  ): Promise<PaginationDTO<User>> => {
    try {
      const params: Record<string, string> = { page: page.toString(), limit: limit.toString() };
      if (search) params.search = search;
      if (membershipLevel) params.membershipLevel = membershipLevel;

      return await apiAdmin().get<PaginationDTO<User>>(API_ENDPOINTS_ADMIN.USERS.LIST, params);
    } catch (err: any) {
      console.error("Error getAllUsers:", err);
      return {
        code: 1,
        message: err.message ?? "Failed to fetch users",
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      };
    }
  },

  delete: async (id: string): Promise<ApiResponse<null>> => {
    try {
      return await apiAdmin().delete<ApiResponse<null>>(API_ENDPOINTS_ADMIN.USERS.DELETE(id));
    } catch (err: any) {
      console.error(`Error deleting user with ID ${id}:`, err);
      return { code: 1, message: err.message ?? "Failed to delete user", data: null };
    }
  },

  getAllMembershipLevel: async (): Promise<ApiResponse<any[]>> => {
    try {
      return await apiAdmin().get<ApiResponse<any[]>>(API_ENDPOINTS_ADMIN.USERS.LIST_MEMBERSHIP_LEVEL);
    } catch (err: any) {
      console.error("Error fetching all membership levels:", err);
      return { code: 1, message: err.message ?? "Failed to fetch membership levels", data: [] };
    }
  },

  getMembershipLevelById: async (id: string): Promise<ApiResponse<any>> => {
    try {
      return await apiAdmin().get<ApiResponse<any>>(API_ENDPOINTS_ADMIN.USERS.GET_MEMBERSHIP_LEVEL_BY_ID(id));
    } catch (err: any) {
      console.error(`Error fetching membership level ID ${id}:`, err);
      return { code: 1, message: err.message ?? "Failed to fetch membership level", data: undefined as any };
    }
  },

  updateMembershipLevel: async (id: string, payload: any): Promise<ApiResponse<any>> => {
    try {
      return await apiAdmin().put<ApiResponse<any>>(API_ENDPOINTS_ADMIN.USERS.UPDATE_MEMBERSHIP_LEVEL(id), payload);
    } catch (err: any) {
      console.error(`Error updating membership level ${id}:`, err);
      return { code: 1, message: err.message ?? "Failed to update membership level", data: undefined as any };
    }
  },

  toggleActive: async (id: string): Promise<ApiResponse<User>> => {
    try {
      return await apiAdmin().patch<ApiResponse<User>>(API_ENDPOINTS_ADMIN.USERS.TOGGLE_ACTIVE(id));
    } catch (err: any) {
      console.error(`Error toggling active status for user ID ${id}:`, err);
      return { code: 1, message: err.message ?? "Failed to toggle active status", data: undefined as any };
    }
  },

  createMembershipBenefit: async (payload: CreateMembershipBenefit): Promise<ApiResponse<CreateMembershipBenefit>> => {
    try {
      return await apiAdmin().post<ApiResponse<CreateMembershipBenefit>>(API_ENDPOINTS_ADMIN.USERS.CREATE_MEMBERSHIP_BENEFIT, payload);
    } catch (err: any) {
      console.error("Error creating membership benefit:", err);
      return { code: 1, message: err.message ?? "Failed to create benefit", data: undefined as any };
    }
  },

  getAllMembershipBenefit: async (): Promise<ApiResponse<MembershipBenefitDTO[]>> => {
    try {
      return await apiAdmin().get<ApiResponse<MembershipBenefitDTO[]>>(API_ENDPOINTS_ADMIN.USERS.LIST_MEMBERSHIP_BENEFIT);
    } catch (err: any) {
      console.error("Error fetching all benefits:", err);
      return { code: 1, message: err.message ?? "Failed to fetch benefits", data: [] };
    }
  },

  getMembershipBenefitById: async (id: string): Promise<ApiResponse<MembershipBenefitDTO>> => {
    try {
      return await apiAdmin().get<ApiResponse<MembershipBenefitDTO>>(API_ENDPOINTS_ADMIN.USERS.GET_MEMBERSHIP_BENEFIT_BY_ID(id));
    } catch (err: any) {
      console.error(`Error fetching benefit ID ${id}:`, err);
      return { code: 1, message: err.message ?? "Failed to fetch benefit", data: undefined as any };
    }
  },

  updateMembershipBenefit: async (id: string, payload: UpdateMembershipBenefit): Promise<ApiResponse<UpdateMembershipBenefit>> => {
    try {
      return await apiAdmin().put<ApiResponse<UpdateMembershipBenefit>>(API_ENDPOINTS_ADMIN.USERS.UPDATE_MEMBERSHIP_BENEFIT(id), payload);
    } catch (err: any) {
      console.error(`Error updating benefit ID ${id}:`, err);
      return { code: 1, message: err.message ?? "Failed to update benefit", data: undefined as any };
    }
  },

  deleteMembershipBenefit: async (id: string): Promise<ApiResponse<null>> => {
    try {
      return await apiAdmin().delete<ApiResponse<null>>(API_ENDPOINTS_ADMIN.USERS.DELETE_MEMBERSHIP_BENEFIT(id));
    } catch (err: any) {
      console.error(`Error deleting benefit ID ${id}:`, err);
      return { code: 1, message: err.message ?? "Failed to delete benefit", data: null };
    }
  },

  getAllRewardHistory: async (
    page = 1,
    limit = 20,
    userId?: string,
    search?: string,
    historyType?: "earned" | "used" | "refunded" | "pending_reward" | "none"| null,
    fromDate?: string,
    toDate?: string
  ): Promise<PaginationDTO<any>> => {
    try {
      const params: Record<string,string> = { page: page.toString(), limit: limit.toString() };
      if (userId) params.userId = userId;
      if (search) params.search = search;
      if (historyType) params.historyType = historyType;
      if (fromDate) params.fromDate = fromDate;
      if (toDate) params.toDate = toDate;

      return await apiAdmin().get<PaginationDTO<any>>(API_ENDPOINTS_ADMIN.USERS.REWARD_HISTORY, params);
    } catch (err: any) {
      console.error("Error fetching reward history:", err);
      return {
        code: 1,
        message: err.message ?? "Failed to fetch reward history",
        data: [],
        pagination: { page, limit, total: 0, totalPages: 0 },
      };
    }
  },
};

// import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin'
// import type { User, MembershipBenefitDTO, CreateMembershipBenefit, UpdateMembershipBenefit } from '@/server/types/dto/v1/user.dto'
// import type { ApiResponse } from '@server/types/common/api-response'
// import type { PaginationDTO } from '@server/types/common/pagination.dto'

// export const usersAPI = {
//   getDetailAccount: async (id: string) => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.USERS.GET_BY_ID(id)}`)
//       if (!response.ok) {
//         throw new Error(`Failed to fetch user with ID ${id}`)
//       }
//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error(`Error getting user detail with ID ${id}:`, err)
//       throw err
//     }
//   },
//   getAllUsers: async (page: number = 1, limit: number = 10, search?: string, membershipLevel?: string) => {
//     try {

//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//       });

//       if (search) params.append("search", search);
//       if (membershipLevel) params.append("membershipLevel", membershipLevel);

//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.USERS.LIST}?${params}`);
//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }
//       const data = await response.json();
//       return data;
//     } catch (err) {
//       console.error("Error getAllUsers:", err);
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
//       }
//     }
//   },
//   delete: async (id:string) => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.USERS.DELETE(id)}`, {
//         method: 'DELETE',
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
//       }

//       return await response.json()
//     } catch (err) {
//       console.error(`Error deleting user with ID ${id}:`, err)
//       throw err
//     }
//   },
//   getAllMembershipLevel: async () => {
//   try {
//       const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.USERS.LIST_MEMBERSHIP_LEVEL}`,{
//           credentials: "include",
//         })
//       const data = await response.json()
//       return data;
//     } catch (err) {
//       console.error('Error:', err)
//     }
//   },
//   getMembershipLevelById: async (id: string) => {
//     try {
//       const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.USERS.GET_MEMBERSHIP_LEVEL_BY_ID(id)}`,{
//           credentials: "include",
//         })
//       if (!response.ok) {
//         throw new Error(`Failed to fetch membership level with ID ${id}`)
//       }
//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error(`Error getting membership level with ID ${id}:`, err)
//       throw err
//     }
//   },
//   updateMembershipLevel: async (id: string, payload: any) => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.USERS.UPDATE_MEMBERSHIP_LEVEL(id)}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
//       }

//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error(`Error updating membership level ${id}:`, err)
//       throw err
//     }
//   },
//   toggleActive: async (id: string): Promise<ApiResponse<User>> => {
//     try {
//       const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.USERS.TOGGLE_ACTIVE(id)}`, {
//         method: 'PATCH',
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         return {
//           code: 1,
//           message: errorData.message || 'Failed to toggle active status',
//           data: undefined as any
//         }
//       }

//       const data: ApiResponse<User> = await response.json()
//       return data
//     } catch (err) {
//       console.error(`Error toggling active status for user ID ${id}:`, err)
//       return {
//         code: 1,
//         message: 'Unexpected error while toggling active status',
//         data: undefined as any
//       }
//     }
//   },
//   createMembershipBenefit: async (payload: CreateMembershipBenefit): Promise<ApiResponse<CreateMembershipBenefit>> => {
//     try {
//       const res = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.USERS.CREATE_MEMBERSHIP_BENEFIT}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       })
//       if (!res.ok) {
//         const errData = await res.json()
//         throw new Error(errData.message || `HTTP error! status: ${res.status}`)
//       }
//       return await res.json()
//     } catch (err) {
//       console.error('Error creating benefit:', err)
//       throw err
//     }
//   },
//   getAllMembershipBenefit: async (): Promise<ApiResponse<MembershipBenefitDTO[]>> => {
//     try {
//       const res = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.USERS.LIST_MEMBERSHIP_BENEFIT}`,{
//           credentials: "include",
//         })
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
//       return await res.json()
//     } catch (err) {
//       console.error('Error fetching all benefits:', err)
//       throw err
//     }
//   },
//   getMembershipBenefitById: async (id: string): Promise<ApiResponse<MembershipBenefitDTO>> => {
//     try {
//       const res = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.USERS.GET_MEMBERSHIP_BENEFIT_BY_ID(id)}`,{
//           credentials: "include",
//         })
//       if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`)
//       return await res.json()
//     } catch (err) {
//       console.error(`Error fetching benefit ${id}:`, err)
//       throw err
//     }
//   },
//   updateMembershipBenefit: async (id: string, payload: UpdateMembershipBenefit ): Promise<ApiResponse<UpdateMembershipBenefit>> => {
//     try {
//       const res = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.USERS.UPDATE_MEMBERSHIP_BENEFIT(id)}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(payload),
//       })
//       if (!res.ok) {
//         const errData = await res.json()
//         throw new Error(errData.message || `HTTP error! status: ${res.status}`)
//       }
//       return await res.json()
//     } catch (err) {
//       console.error(`Error updating benefit ${id}:`, err)
//       throw err
//     }
//   },
//   deleteMembershipBenefit: async (id: string): Promise<ApiResponse<null>> => {
//     try {
//       const res = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.USERS.DELETE_MEMBERSHIP_BENEFIT(id)}`,
//         {
//           method: 'DELETE',
//          }
//       )

//       const data = await res.json()

//       if (data.code !== 0) {
//         return {
//           code: data.code,
//           message: data.message || 'Không thể xóa benefit',
//           data: null,
//         }
//       }

//       return {
//         code: 0,
//         message: data.message || 'Xóa benefit thành công',
//         data: null,
//       }
//     } catch (err: any) {
//       console.error(`Error deleting benefit ${id}:`, err)
//       return {
//         code: 1,
//         message: err.message || 'Lỗi kết nối đến máy chủ',
//         data: null,
//       }
//     }
//   },
//   getAllRewardHistory: async (
//     page = 1,
//     limit = 20,
//       userId?: string,
//       search?: string,
//       historyType?: "earned" | "used" | "refunded" | "pending_reward" | "none"| null,
//       fromDate?: string,
//       toDate?: string,
//   ): Promise<PaginationDTO<any>> => {
//     try {
//       const params = new URLSearchParams({
//         page: page.toString(),
//         limit: limit.toString(),
//       })

//       if (userId) params.append('userId', userId)
//       if (search) params.append('search', search)
//       if (historyType) params.append('historyType', historyType)
//       if (fromDate) params.append('fromDate', fromDate)
//       if (toDate) params.append('toDate', toDate)

//       const response = await fetchWithAuthAdmin(
//         `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.USERS.REWARD_HISTORY}?${params.toString()}`)

//       if (!response.ok) {
//         const errorData = await response.json()
//         return {
//           code: 1,
//           message: errorData.message || 'Failed to fetch reward history for admin',
//           data: [],
//           pagination: {
//             page,
//             limit,
//             total: 0,
//             totalPages: 0,
//           },
//         }
//       }

//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error('Error fetching admin reward history:', err)
//       return {
//         code: 1,
//         message: 'Unexpected error while fetching reward history for admin',
//         data: [],
//         pagination: {
//           page,
//           limit,
//           total: 0,
//           totalPages: 0,
//         },
//       }
//     }
//   },
// }