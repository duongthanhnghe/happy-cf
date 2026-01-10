import { apiClient } from '../http/apiClient'
import { API_ENDPOINTS } from '../const/api.const'
import { fetchRawClient } from '../http/fetchRawClient'

export const fileManageAPI = {
  getImages: async (
    folder: string,
    max_results: number,
    next_cursor?: string
  ): Promise<any> => {
    try {
      return await apiClient().get(
        API_ENDPOINTS.FILE_MANAGE.GET_IMAGES(folder),
        {
          max_results,
          ...(next_cursor ? { next_cursor } : {})
        }
      )
    } catch (err: any) {
      console.error('Error fetching images:', err)
      return { success: false, images: [], next_cursor: null }
    }
  },

  deleteImage: async (publicId: string): Promise<any> => {
    try {
      const encodedId = encodeURIComponent(publicId)
      return await apiClient().delete(API_ENDPOINTS.FILE_MANAGE.DELETE_IMAGE(encodedId))
    } catch (err: any) {
      console.error('Error deleting image:', err)
      return { code: 1, message: err.message, data: null }
    }
  },

  searchImage: async (url: string, folder?: string): Promise<any> => {
    try {
      const params: Record<string, string> = { url }
      if (folder) params.folder = folder
      const query = new URLSearchParams(params).toString()

      return await apiClient().get(`${API_ENDPOINTS.FILE_MANAGE.SEARCH_IMAGE()}?${query}`)
    } catch (err: any) {
      console.error('Error searching image:', err)
      return { success: false ,code: 1, message: err.message, data: null }
    }
  },

  uploadImage: async (files: File[], folder: string): Promise<any> => {
    try {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      formData.append('folder', folder)

      const res = await fetchRawClient(
        `${API_ENDPOINTS.FILE_MANAGE.UPLOAD}`,
        { method: "POST", body: formData, }
      )

      return res.json()
    } catch (err: any) {
      console.error('Upload image error:', err)
      return { code: 1, message: 'Upload failed', data: null }
    }
  },

  uploadAvatar: async (files: File[], folder: string, userId: string): Promise<any> => {
    try {
      const formData = new FormData()
      files.forEach(file => formData.append('files', file))
      formData.append('folder', folder)
      formData.append('userId', userId)

      const res = await fetchRawClient(
        `${API_ENDPOINTS.FILE_MANAGE.UPLOAD}`,
        { method: "POST", body: formData, }
      )

      return res.json()
    } catch (err: any) {
      console.error('Upload avatar error:', err)
      return { code: 1, message: 'Upload failed', data: null }
    }
  },
}
