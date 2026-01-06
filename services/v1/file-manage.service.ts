import { apiClient } from '../http/apiClient'
import { API_ENDPOINTS } from '../const/api.const'
import type { ApiResponse } from '@/server/types/common/api-response'

export const fileManageAPI = {
  getImages: async (
    folder: string,
    max_results: number = 10,
    next_cursor?: string
  ): Promise<ApiResponse<any>> => {
    try {
      const params = new URLSearchParams({ max_results: max_results.toString() })
      if (next_cursor) params.append('next_cursor', next_cursor)

      return await apiClient().get(
        `${API_ENDPOINTS.FILE_MANAGE.GET_IMAGES(folder, max_results)}?${params.toString()}`
      )
    } catch (err: any) {
      console.error('Error fetching images:', err)
      return { code: 1, message: err.message, data: [] }
    }
  },

  deleteImage: async (publicId: string): Promise<ApiResponse<any>> => {
    try {
      const encodedId = encodeURIComponent(publicId)
      return await apiClient().delete(API_ENDPOINTS.FILE_MANAGE.DELETE_IMAGE(encodedId))
    } catch (err: any) {
      console.error('Error deleting image:', err)
      return { code: 1, message: err.message, data: null }
    }
  },

  searchImage: async (url: string, folder?: string): Promise<ApiResponse<any>> => {
    try {
      const params: Record<string, string> = { url }
      if (folder) params.folder = folder
      const query = new URLSearchParams(params).toString()

      return await apiClient().get(`${API_ENDPOINTS.FILE_MANAGE.SEARCH_IMAGE()}?${query}`)
    } catch (err: any) {
      console.error('Error searching image:', err)
      return { code: 1, message: err.message, data: null }
    }
  },

  uploadImage: async (files: File[], folder: string): Promise<ApiResponse<any>> => {
    try {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      formData.append('folder', folder)

      return await apiClient().post(API_ENDPOINTS.FILE_MANAGE.UPLOAD, formData)
    } catch (err: any) {
      console.error('Upload image error:', err)
      return { code: 1, message: 'Upload failed', data: null }
    }
  },

  uploadAvatar: async (files: File[], folder: string, userId: string): Promise<ApiResponse<any>> => {
    try {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      formData.append('folder', folder)
      formData.append('userId', userId)

      return await apiClient().post(API_ENDPOINTS.FILE_MANAGE.UPLOAD, formData)
    } catch (err: any) {
      console.error('Upload avatar error:', err)
      return { code: 1, message: 'Upload failed', data: null }
    }
  },
}
