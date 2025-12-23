import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin'
import type { ApiResponse } from '@/server/types/common/api-response'
import type { AccountDTO, ChangePasswordDTO, LoginDTO, AccountLoginResponse, AccountUpdateDTO, AccountPaginationDTO, AccountCreateDTO, AccountRoleType } from '@/server/types/dto/v1/account.dto'
import { useRequestHeaders } from 'nuxt/app'
import { useAccountStore } from '@/stores/admin/account/useAccountStore'
import { fetchWithAuthAdmin } from '@/services/helpers/fetchWithAuthAdmin'

export const accountAPI = {
  verifyToken: async () => {
    try {
      const token = useAccountStore().token;

      const headers: any = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ACCOUNT.VERIFY_TOKEN}`,
        {
          method: "GET",
          credentials: "include",
          headers
        }
      );

      return await response.json();
    } catch (err) {
      return { code: 1, message: (err as Error).message, data: null };
    }
  },
  refreshToken: async (): Promise<ApiResponse<{ accessToken: string }>> => {
    try {
      const headers = process.client
        ? {}
        : useRequestHeaders(['cookie'])

      const response = await fetch(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ACCOUNT.REFRESH_TOKEN}`,
        {
          method: 'POST',
          credentials: 'include',
          headers
        }
      )

      return await response.json()
    } catch (err) {
      return { code: 1, message: (err as Error).message, data: null as any }
    }
  },
  Login: async (loginData: LoginDTO): Promise<ApiResponse<AccountLoginResponse>> => {
    try {
      const resultData = {
        email: loginData.email.trim(),
        password: loginData.password.trim(),
      }

      if (!resultData.email || !resultData.password) {
        throw new Error('Missing required fields: email, password')
      }

      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ACCOUNT.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(resultData),
      })

      const data = await response.json()

      if (!response.ok || data.code !== 0) {
        throw new Error(data.message || `HTTP error! status: ${response.status}`)
      }

      return data
    } catch (err) {
      console.error('Error admin login:', err)
      throw err
    }
  },
  resetPassword: async (email: string, newPassword: string) => {
    const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ACCOUNT.RESET_PASSWORD}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, newPassword }),
    });

    const data = await response.json();
    if (!response.ok || data.code !== 0) {
      throw new Error(data.message || 'Đặt lại mật khẩu thất bại');
    }

    return data;
  },
  getAccount: async (id: string): Promise<ApiResponse<AccountDTO>> => {
    const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ACCOUNT.GET_ME(id)}`, {
      method: 'GET',
    })

    const data = await response.json()
    if (!response.ok || data.code !== 0) {
      throw new Error(data.message || 'Không thể lấy thông tin admin')
    }

    return data
  },
  updateAccount: async (payload: AccountUpdateDTO): Promise<ApiResponse<AccountDTO>> => {
    const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ACCOUNT.UPDATE}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    if (!response.ok || data.code !== 0) {
      throw new Error(data.message || 'Cập nhật thông tin thất bại')
    }

    return data
  },
  changePassword: async (payload: ChangePasswordDTO): Promise<ApiResponse<null>> => {
    const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ACCOUNT.CHANGE_PASSWORD}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    if (!response.ok || data.code !== 0) {
      throw new Error(data.message || 'Đổi mật khẩu thất bại')
    }

    return data
  },
  Logout: async (): Promise<ApiResponse<null>> => {
    const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ACCOUNT.LOGOUT}`, {
      method: 'POST',
      credentials: "include",
    })

    const data = await response.json()
    if (!response.ok || data.code !== 0) {
      throw new Error(data.message || 'Đổi mật khẩu thất bại')
    }

    return data
  },
  getAccountList: async (
    page = 1,
    limit = 10,
    search: string,
    role: AccountRoleType|null,
  ): Promise<AccountPaginationDTO> => {
    try {
      const query = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
        search: search || '',
        role: role || '',
      });

      const response = await fetchWithAuthAdmin(
        `${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ACCOUNT.ACCOUNT_LIST}?${query.toString()}`,
        {
          method: "GET",
          headers: { 'Content-Type': 'application/json' },
        }
      );

      const data = await response.json();

      return data;
    } catch (err) {
      console.error("Error getAccountList:", err);
      return {
        code: 500,
        message: "Lỗi kết nối server",
      } as any;
    }
  },
  delete: async (id:string) => {
    try {
      const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ACCOUNT.DELETE(id)}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      return await response.json()
    } catch (err) {
      console.error(`Error deleting user with ID ${id}:`, err)
      throw err
    }
  },
  toggleActive: async (id: string): Promise<ApiResponse<AccountDTO>> => {
    try {
      const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ACCOUNT.TOGGLE_ACTIVE(id)}`, {
        method: 'PATCH',
      })

      if (!response.ok) {
        const errorData = await response.json()
        return {
          code: 1,
          message: errorData.message || 'Failed to toggle active status',
          data: undefined as any
        }
      }

      const data: ApiResponse<AccountDTO> = await response.json()
      return data
    } catch (err) {
      console.error(`Error toggling active status for user ID ${id}:`, err)
      return {
        code: 1,
        message: 'Unexpected error while toggling active status',
        data: undefined as any
      }
    }
  },
  create: async (bodyData: AccountCreateDTO) => {
    try {
      if (!bodyData.email || !bodyData.role || !bodyData.fullname || !bodyData.password) {
        throw new Error('Missing required fields:fullname, email, password')
      }

      const response = await fetchWithAuthAdmin(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ACCOUNT.CREATE}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bodyData),
      })

      const data = await response.json()
      if (!response.ok || data.code !== 0) {
        throw new Error(data.message || 'Tạo tài khoản thất bại')
      }

      return data
    } catch (err) {
      console.error('Error creating admin account:', err)
      throw err
    }
  },
}
