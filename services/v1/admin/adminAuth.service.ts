import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS_ADMIN } from '@/services/const/api-endpoints-admin'
import type { ApiResponse } from '@/server/types/common/api-response'
import type { AdminAccountDTO, ChangePasswordDTO, AdminLoginDTO, AdminLoginResponse, AdminUpdateDTO } from '@/server/types/dto/v1/admin-auth.dto'

export const adminAuthAPI = {
   verifyToken: async (): Promise<ApiResponse<AdminAccountDTO>> => {
    const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ADMIN_AUTH.VERIFY_TOKEN}`, {
      method: 'GET',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()
    if (!response.ok || data.code !== 0) {
      throw new Error(data.message || 'Token không hợp lệ hoặc đã hết hạn')
    }

    return data
  },
  Login: async (loginData: AdminLoginDTO): Promise<ApiResponse<AdminLoginResponse>> => {
    try {
      const resultData = {
        email: loginData.email.trim(),
        password: loginData.password.trim(),
      }

      if (!resultData.email || !resultData.password) {
        throw new Error('Missing required fields: email, password')
      }

      const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ADMIN_AUTH.LOGIN}`, {
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
    const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ADMIN_AUTH.RESET_PASSWORD}`, {
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
  getAccount: async (id: string): Promise<ApiResponse<AdminAccountDTO>> => {
    const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ADMIN_AUTH.GET_ME(id)}`, {
      method: 'GET',
      credentials: 'include',
    })

    const data = await response.json()
    if (!response.ok || data.code !== 0) {
      throw new Error(data.message || 'Không thể lấy thông tin admin')
    }

    return data
  },
  updateAccount: async (payload: AdminUpdateDTO): Promise<ApiResponse<AdminAccountDTO>> => {
    const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ADMIN_AUTH.UPDATE}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    if (!response.ok || data.code !== 0) {
      throw new Error(data.message || 'Cập nhật thông tin thất bại')
    }

    return data
  },
  changePassword: async (payload: ChangePasswordDTO): Promise<ApiResponse<null>> => {
    const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ADMIN_AUTH.CHANGE_PASSWORD}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
      body: JSON.stringify(payload),
    })

    const data = await response.json()
    if (!response.ok || data.code !== 0) {
      throw new Error(data.message || 'Đổi mật khẩu thất bại')
    }

    return data
  },
  Logout: async (): Promise<ApiResponse<null>> => {
    const response = await fetch(`${apiConfig.adminApiURL}${API_ENDPOINTS_ADMIN.ADMIN_AUTH.LOGOUT}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    })

    const data = await response.json()
    if (!response.ok || data.code !== 0) {
      throw new Error(data.message || 'Đổi mật khẩu thất bại')
    }

    return data
  },
}
