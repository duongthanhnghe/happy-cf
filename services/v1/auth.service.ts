import { apiConfig } from '@/services/config/api.config'
import { API_ENDPOINTS } from '@/services/const/api.const'
import type { UserRegister, UserEdit, UserLogin, ResetPassword, ChangePassword } from '@/server/types/dto/v1/user.dto.js'
import type { ApiResponse } from '@server/types/common/api-response'
import { useRequestHeaders } from 'nuxt/app'
import { useAccountStore } from '@/stores/client/users/useAccountStore'
import { fetchWithAuth } from '../helpers/fetchWithAuth'

export const authAPI = {
  verifyToken: async () => {
    try {
      const token = useAccountStore().token;

      const headers: any = {};
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.VERIFY_TOKEN}`,
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
  Login: async (loginData: UserLogin) => {
    try {
      const resultData = {
        email: loginData.email.trim(),
        password: loginData.password.trim(),
      }

      if (!resultData.email || !resultData.password) {
        throw new Error('Missing required fields: email, password')
      }

      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.LOGIN}`, {
        method: 'POST',
        credentials: "include",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginData)
      });

      return await response.json();
    } catch (err) {
      console.error('Error login', err)
      throw err
    }
  },
  refreshToken: async (): Promise<ApiResponse<{ accessToken: string }>> => {
    try {
      const headers = process.client
        ? {}
        : useRequestHeaders(['cookie'])

      const response = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
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
  googleLogin: async (googleToken: string) => {
    try {
      if (!googleToken) {
        throw new Error("Thiếu token Google")
      }

      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.GOOGLE_LOGIN}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ token: googleToken }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error("Error during Google login:", err)
      throw err
    }
  },
  Register: async (bodyData: UserRegister) => {
    try {
      if (!bodyData.email || !bodyData.password || !bodyData.fullname) {
        throw new Error('Missing required fields:fullname, email, password')
      }

      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.REGISTER}`, {
        method: 'POST',
        credentials: "include",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(bodyData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error('Error creating category:', err)
      throw err
    }
  },
  ForgotPassword: async (email: string) => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ email })
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Lỗi khi gửi email reset mật khẩu:', error)
      throw error
    }
  },
  ResetPassword: async ({ email, token, newPassword, newPasswordConfirm } : ResetPassword) => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.RESET_PASSWORD}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: "include",
        body: JSON.stringify({ email, token, newPassword, newPasswordConfirm })
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Lỗi khi đặt lại mật khẩu:', error)
      throw error
    }
  },
  ChangePassword: async ({ oldPassword, newPassword } : ChangePassword) => {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.CHANGE_PASSWORD}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ oldPassword, newPassword })
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Lỗi khi doi mật khẩu:', error)
      throw error
    }
  },
  getDetailAccount: async (id: string) => {
    try {
      const response = await fetchWithAuth(`${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.GET_BY_ID(id)}`,{
        method: 'GET',
      })
      if (!response.ok) {
        throw new Error(`Failed to fetch user with ID ${id}`)
      }
      const data = await response.json()
      return data
    } catch (err) {
      console.error(`Error getting user detail with ID ${id}:`, err)
      throw err
    }
  },
  updateAccount: async (payload: UserEdit) => {
    const res = await fetchWithAuth(`${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.UPDATE}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload)
    })

    return await res.json()
  },
  logout: async () => {
    try {
    const res = await fetchWithAuth(`${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.LOGOUT}`, {
      method: 'POST',
    })

    return await res.json()
    } catch (err) {
      console.error(`Error logout`, err)
      throw err
    }
  },
}