import { apiConfig } from '@/config/api.config'
import { API_ENDPOINTS } from '@/const/api.const'
import type { User, UserRegister, UserEdit, UserLogin, ResetPassword, ChangePassword } from '@/server/types/dto/user.dto.js'
import type { ApiResponse } from '@server/types/common/api-response'

export const usersAPI = {
  Login: async (loginData: UserLogin) => {
    try {
      const resultData = {
        email: loginData.email.trim(),
        password: loginData.password.trim(),
      }

      if (!resultData.email || !resultData.password) {
        throw new Error('Missing required fields: email, password')
      }

      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.USERS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(resultData)
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
  Register: async (bodyData: UserRegister) => {
    try {
      if (!bodyData.email || !bodyData.password || !bodyData.fullname) {
        throw new Error('Missing required fields:fullname, email, password')
      }

      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.USERS.REGISTER}`, {
        method: 'POST',
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
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.USERS.FORGOT_PASSWORD}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Lỗi khi gửi email reset mật khẩu:', error)
      throw error
    }
  },
  ResetPassword: async ({ email, token, newPassword } : ResetPassword) => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.USERS.RESET_PASSWORD}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, token, newPassword })
      })

      const data = await response.json()
      return data
    } catch (error) {
      console.error('Lỗi khi đặt lại mật khẩu:', error)
      throw error
    }
  },
  ChangePassword: async ({ userId, oldPassword, newPassword } : ChangePassword) => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.USERS.CHANGE_PASSWORD}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId, oldPassword, newPassword })
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
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.USERS.GET_BY_ID(id)}`)
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
    const token = localStorage.getItem('token')
    const res = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.USERS.UPDATE}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    })

    return await res.json()
  },
  getAllUsers: async (page: number = 1, limit: number = 10, role: number = 1) => {
    try {
      const response = await fetch(
        `${apiConfig.baseApiURL}${API_ENDPOINTS.USERS.LIST}?page=${page}&limit=${limit}&role=${role}`
      );
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error getAllUsers:", err);
      return {
        code: 1,
        message: "Failed to fetch orders",
        data: [],
        pagination: {
          total: 0,
          totalPages: 0,
          page: 1,
          limit,
        },
      }
    }
  },
  delete: async (id:string) => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.USERS.DELETE(id)}`, {
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
  getAllMembershipLevel: async () => {
  try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.USERS.LIST_MEMBERSHIP_LEVEL}`)
      const data = await response.json()
      return data;
    } catch (err) {
      console.error('Error:', err)
    }
  },
  setMemberPoint: async (userId: string, point: number) => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.USERS.SET_POINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ userId, point }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error(`Error adding point for user ${userId}:`, err)
      throw err
    }
  },
  getTopSearchKeyword: async (limit: number) => {
  try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.USERS.LIST_SEARCH_KEYWORD(limit)}`)
      const data = await response.json()
      return data;
    } catch (err) {
      console.error('Error:', err)
    }
  },
  logSearchKeyword: async (keyword: string) => {
    try {
      const res = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.USERS.LOG_SEARCH_KEYWORD}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword }),
      })

      const result = await res.json()
      return result
    } catch (err) {
      console.error('Error logging search keyword:', err)
    }
  },
  toggleActive: async (id: string): Promise<ApiResponse<User>> => {
    try {
      const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.USERS.TOGGLE_ACTIVE(id)}`, {
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

      const data: ApiResponse<User> = await response.json()
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
}