import { apiClient } from '@/services/http/apiClient'
import { API_ENDPOINTS } from '@/services/const/api.const'
import type {
  UserRegister,
  UserEdit,
  UserLogin,
  ResetPassword,
  ChangePassword,
  LoginResponseDTO,
  User
} from '@/server/types/dto/v1/user.dto.js'
import { apiError, ApiErrorCode } from '@/server/types/common/api-response'
import type { ApiResponse } from '@server/types/common/api-response'

export const authAPI = {
  verifyToken: async (): Promise<ApiResponse<User>> => {
    try {
      return await apiClient().authGet<ApiResponse<User>>(API_ENDPOINTS.AUTH.VERIFY_TOKEN)
    } catch (err: any) {
      console.error('[authAPI.verifyToken]', err)
      return apiError<User>(err)
    }
  },

  Login: async (loginData: UserLogin): Promise<ApiResponse<LoginResponseDTO>> => {
    try {
      const payload = {
        email: loginData.email.trim(),
        password: loginData.password.trim(),
      }
      return await apiClient().post<ApiResponse<LoginResponseDTO>>(API_ENDPOINTS.AUTH.LOGIN, payload)
    } catch (err: any) {
      console.error('[authAPI.Login]', err)
      return apiError<LoginResponseDTO>(err)
    }
  },

  refreshToken: async (): Promise<ApiResponse<{ accessToken: string }>> => {
    try {
      return await apiClient().post<ApiResponse<{ accessToken: string }>>(API_ENDPOINTS.AUTH.REFRESH_TOKEN)
    } catch (err: any) {
      console.error('[authAPI.refreshToken]', err)
      return apiError<{ accessToken: string }>(err)
    }
  },

  googleLogin: async (googleToken: string): Promise<ApiResponse<LoginResponseDTO>> => {
    if (!googleToken) {
      return {
        code: ApiErrorCode.VALIDATION,
        message: 'Thiếu token Google',
        data: null as unknown as LoginResponseDTO
      }
    }

    try {
      return await apiClient().post<ApiResponse<LoginResponseDTO>>(API_ENDPOINTS.AUTH.GOOGLE_LOGIN, { token: googleToken })
    } catch (err: any) {
      console.error('[authAPI.googleLogin]', err)
      return apiError<LoginResponseDTO>(err)
    }
  },

  Register: async (bodyData: UserRegister): Promise<ApiResponse<User>> => {
    try {
      return await apiClient().post<ApiResponse<User>>(API_ENDPOINTS.AUTH.REGISTER, bodyData)
    } catch (err: any) {
      console.error('[authAPI.Register]', err)
      return apiError<User>(err)
    }
  },

  ForgotPassword: async (email: string): Promise<ApiResponse<null>> => {
    try {
      return await apiClient().post<ApiResponse<null>>(API_ENDPOINTS.AUTH.FORGOT_PASSWORD, { email })
    } catch (err: any) {
      console.error('[authAPI.ForgotPassword]', err)
      return apiError<null>(err)
    }
  },

  ResetPassword: async (payload: ResetPassword): Promise<ApiResponse<null>> => {
    try {
      return await apiClient().post<ApiResponse<null>>(API_ENDPOINTS.AUTH.RESET_PASSWORD, payload)
    } catch (err: any) {
      console.error('[authAPI.ResetPassword]', err)
      return apiError<null>(err)
    }
  },

  ChangePassword: async (payload: ChangePassword): Promise<ApiResponse<null>> => {
    try {
      return await apiClient().authPost<ApiResponse<null>>(API_ENDPOINTS.AUTH.CHANGE_PASSWORD, payload)
    } catch (err: any) {
      console.error('[authAPI.ChangePassword]', err)
      return apiError<null>(err)
    }
  },

  getDetailAccount: async (id: string): Promise<ApiResponse<User>> => {
    try {
      return await apiClient().get<ApiResponse<User>>(API_ENDPOINTS.AUTH.GET_BY_ID(id))
    } catch (err: any) {
      console.error('[authAPI.getDetailAccount]', err)
      return apiError<User>(err)
    }
  },

  updateAccount: async (payload: UserEdit): Promise<ApiResponse<User>> => {
    try {
      return await apiClient().authPut<ApiResponse<User>>(API_ENDPOINTS.AUTH.UPDATE, payload)
    } catch (err: any) {
      console.error('[authAPI.updateAccount]', err)
      return apiError<User>(err)
    }
  },

  logout: async (): Promise<ApiResponse<null>> => {
    try {
      return await apiClient().authPost<ApiResponse<null>>(API_ENDPOINTS.AUTH.LOGOUT)
    } catch (err: any) {
      console.error('[authAPI.logout]', err)
      return apiError<null>(err)
    }
  },
}

// import { API_ENDPOINTS } from '@/services/const/api.const'
// import type { UserRegister, UserEdit, UserLogin, ResetPassword, ChangePassword } from '@/server/types/dto/v1/user.dto.js'
// import type { ApiResponse } from '@server/types/common/api-response'
// import { useRequestHeaders } from 'nuxt/app'
// import { useAccountStore } from '@/stores/client/users/useAccountStore'

// export const authAPI = {
//   verifyToken: async () => {
//     try {
//       const token = useAccountStore().token;

//       const headers: any = {};
//       if (token) {
//         headers.Authorization = `Bearer ${token}`;
//       }

//       const response = await fetch(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.VERIFY_TOKEN}`,
//         {
//           method: "GET",
//           credentials: "include",
//           headers
//         }
//       );

//       return await response.json();
//     } catch (err) {
//       return { code: 1, message: (err as Error).message, data: null };
//     }
//   },
//   Login: async (loginData: UserLogin) => {
//     try {
//       const resultData = {
//         email: loginData.email.trim(),
//         password: loginData.password.trim(),
//       }

//       if (!resultData.email || !resultData.password) {
//         throw new Error('Missing required fields: email, password')
//       }

//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.LOGIN}`, {
//         method: 'POST',
//         credentials: "include",
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify(loginData)
//       });

//       return await response.json();
//     } catch (err) {
//       console.error('Error login', err)
//       throw err
//     }
//   },
//   refreshToken: async (): Promise<ApiResponse<{ accessToken: string }>> => {
//     try {
//       const headers = process.client
//         ? {}
//         : useRequestHeaders(['cookie'])

//       const response = await fetch(
//         `${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.REFRESH_TOKEN}`,
//         {
//           method: 'POST',
//           credentials: 'include',
//           headers
//         }
//       )

//       return await response.json()
//     } catch (err) {
//       return { code: 1, message: (err as Error).message, data: null as any }
//     }
//   },
//   googleLogin: async (googleToken: string) => {
//     try {
//       if (!googleToken) {
//         throw new Error("Thiếu token Google")
//       }

//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.GOOGLE_LOGIN}`, {
//         method: "POST",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//         body: JSON.stringify({ token: googleToken }),
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
//       }

//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error("Error during Google login:", err)
//       throw err
//     }
//   },
//   Register: async (bodyData: UserRegister) => {
//     try {
//       if (!bodyData.email || !bodyData.password || !bodyData.fullname) {
//         throw new Error('Missing required fields:fullname, email, password')
//       }

//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.REGISTER}`, {
//         method: 'POST',
//         credentials: "include",
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(bodyData)
//       })

//       if (!response.ok) {
//         const errorData = await response.json()
//         throw new Error(errorData.message || `HTTP error! status: ${response.status}`)
//       }

//       const data = await response.json()
//       return data
//     } catch (err) {
//       console.error('Error creating category:', err)
//       throw err
//     }
//   },
//   ForgotPassword: async (email: string) => {
//     try {
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.FORGOT_PASSWORD}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: "include",
//         body: JSON.stringify({ email })
//       })

//       const data = await response.json()
//       return data
//     } catch (error) {
//       console.error('Lỗi khi gửi email reset mật khẩu:', error)
//       throw error
//     }
//   },
//   ResetPassword: async ({ email, token, newPassword, newPasswordConfirm } : ResetPassword) => {
//     try {
//       const response = await fetch(`${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.RESET_PASSWORD}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         credentials: "include",
//         body: JSON.stringify({ email, token, newPassword, newPasswordConfirm })
//       })

//       const data = await response.json()
//       return data
//     } catch (error) {
//       console.error('Lỗi khi đặt lại mật khẩu:', error)
//       throw error
//     }
//   },
//   ChangePassword: async ({ oldPassword, newPassword } : ChangePassword) => {
//     try {
//       const response = await fetchWithAuth(`${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.CHANGE_PASSWORD}`, {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ oldPassword, newPassword })
//       })

//       const data = await response.json()
//       return data
//     } catch (error) {
//       console.error('Lỗi khi doi mật khẩu:', error)
//       throw error
//     }
//   },
//   getDetailAccount: async (id: string) => {
//     try {
//       const response = await fetchWithAuth(`${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.GET_BY_ID(id)}`,{
//         method: 'GET',
//       })
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
//   updateAccount: async (payload: UserEdit) => {
//     const res = await fetchWithAuth(`${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.UPDATE}`, {
//       method: 'PUT',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(payload)
//     })

//     return await res.json()
//   },
//   logout: async () => {
//     try {
//     const res = await fetchWithAuth(`${apiConfig.baseApiURL}${API_ENDPOINTS.AUTH.LOGOUT}`, {
//       method: 'POST',
//     })

//     return await res.json()
//     } catch (err) {
//       console.error(`Error logout`, err)
//       throw err
//     }
//   },
// }